import logging

from django.db.models import Q
from django.db.models.deletion import ProtectedError
from django.db.models.functions import Lower
from rest_framework.response import Response
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from mainsite.models import Artist, Author, Book, Character, Format, Publisher, SubCategory, Team, UserProfile
from .serializers import ArtistSerializer, AuthorSerializer, BookSerializer, CharacterSerializer, FormatSerializer, PublisherSerializer, SubCategorySerializer, TeamSerializer

logger = logging.getLogger(__name__)

DEFAULT_PAGE_SIZE = 24
MAX_PAGE_SIZE = 100


class BooksPagination(PageNumberPagination):
    page_size = DEFAULT_PAGE_SIZE
    page_size_query_param = 'page_size'
    max_page_size = MAX_PAGE_SIZE

    def get_paginated_response(self, data):
        return Response({
            'success': 'true',
            'books': data,
            'has_more': self.page.has_next(),
            'count': self.page.paginator.count,
        })

class BookViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/books/                 -> list (paginated if
                                                       ?page, else the
                                                       full unfiltered list)
        POST   /api/comics/books/                  -> create
        GET    /api/comics/books/<pk>/             -> retrieve
        PUT    /api/comics/books/<pk>/             -> update
        PATCH  /api/comics/books/<pk>/             -> partial_update
        DELETE /api/comics/books/<pk>/             -> destroy
        POST   /api/comics/books/<pk>/wishlist/    -> toggle wishlisted
        POST   /api/comics/books/<pk>/owned/       -> toggle owned
    """
    queryset = Book.objects.with_related()
    serializer_class = BookSerializer
    pagination_class = BooksPagination

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        if self.action in ('wishlist', 'owned'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def _get_profile(self, request):
        if not request.user.is_authenticated:
            return None
        try:
            return UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return None

    def _wishlist_owned_context(self, profile):
        if profile is None:
            return {'wishlisted_ids': set(), 'owned_ids': set()}

        return {
            'wishlisted_ids': set(profile.wishlist_books.values_list('id', flat=True)),
            'owned_ids': set(profile.owned_books.values_list('id', flat=True)),
        }

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action != 'list':
            return queryset

        request = self.request

        title = request.query_params.get('title')
        if title:
            queryset = queryset.filter(title__icontains=title)

        publisher_ids = request.query_params.getlist('publisher')
        if publisher_ids:
            queryset = queryset.filter(publisher__id__in=publisher_ids)

        # Named "book_format" not "format" (DRF reserves the "format"
        # query param)
        format_ids = request.query_params.getlist('book_format')
        if format_ids:
            queryset = queryset.filter(format__id__in=format_ids)

        team_ids = request.query_params.getlist('team')
        if team_ids:
            queryset = queryset.filter(team__id__in=team_ids)

        character_ids = request.query_params.getlist('characters')
        if character_ids:
            queryset = queryset.filter(characters__id__in=character_ids)

        artist_ids = request.query_params.getlist('artists')
        if artist_ids:
            queryset = queryset.filter(artists__id__in=artist_ids)

        author_ids = request.query_params.getlist('authors')
        if author_ids:
            queryset = queryset.filter(authors__id__in=author_ids)

        # De-dupe duplicate rows
        if character_ids or artist_ids or author_ids:
            queryset = queryset.distinct()

        profile = self._get_profile(request)

        wishlisted_only = request.query_params.get('wishlisted') == 'true'
        owned_only = request.query_params.get('owned') == 'true'
        if wishlisted_only or owned_only:
            if profile is None:
                queryset = queryset.none()
            elif wishlisted_only and owned_only:
                # wishlist OR owned
                queryset = queryset.filter(
                    Q(wishlisted_by=profile) | Q(owned_by=profile)
                ).distinct()
            elif wishlisted_only:
                queryset = queryset.filter(wishlisted_by=profile)
            else:
                queryset = queryset.filter(owned_by=profile)

        return queryset.order_by(Lower('title'))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # If this is a list action, add wishlist and owned data to context
        if self.action == 'list':
            profile = self._get_profile(self.request)
            context.update(self._wishlist_owned_context(profile))
        return context

    def list(self, request, *args, **kwargs):
        # Old behavior, list all comics, not currently in use
        if 'page' not in request.query_params:
            books = Book.objects.with_related()
            serializer = self.get_serializer(books, many=True)
            return Response({'success': 'true', 'books': serializer.data})

        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Users can clear authors/artists/characters by omitting those
        # keys entirely
        data = request.data.copy()
        if 'authors' not in data:
            data.setlist('authors', [])
        if 'artists' not in data:
            data.setlist('artists', [])
        if 'characters' not in data:
            data.setlist('characters', [])

        # Always partial
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def wishlist(self, request, pk=None):
        book = self.get_object()
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        if profile.wishlist_books.filter(id=book.id).exists():
            profile.wishlist_books.remove(book)
            is_wishlisted = False
        else:
            profile.wishlist_books.add(book)
            is_wishlisted = True

        return Response({'success': 'true', 'is_wishlisted': is_wishlisted})

    @action(detail=True, methods=['post'])
    def owned(self, request, pk=None):
        book = self.get_object()
        profile, _ = UserProfile.objects.get_or_create(user=request.user)

        if profile.owned_books.filter(id=book.id).exists():
            profile.owned_books.remove(book)
            is_owned = False
        else:
            profile.owned_books.add(book)
            is_owned = True

        return Response({'success': 'true', 'is_owned': is_owned})

class CharacterViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/characters/        -> list
        POST   /api/comics/characters/        -> create
        GET    /api/comics/characters/<pk>/   -> retrieve
        PUT    /api/comics/characters/<pk>/   -> update
        PATCH  /api/comics/characters/<pk>/   -> partial_update
        DELETE /api/comics/characters/<pk>/   -> destroy
    """
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        # Overridden (rather than just perform_destroy) so this can keep the
        # same 409-with-count convention every other delete endpoint in this
        # file uses - DRF's default ValidationError maps to 400, not 409.
        instance = self.get_object()

        book_count = Book.objects.filter(characters=instance).count()
        if book_count:
            return Response(
                {'error': f'Cannot delete: {book_count} book(s) reference this character.'},
                status=status.HTTP_409_CONFLICT,
            )

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this character.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class PublisherViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/publishers/        -> list
        POST   /api/comics/publishers/        -> create
        GET    /api/comics/publishers/<pk>/   -> retrieve
        PUT    /api/comics/publishers/<pk>/   -> update
        PATCH  /api/comics/publishers/<pk>/   -> partial_update
        DELETE /api/comics/publishers/<pk>/   -> destroy
    """
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this publisher.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class AuthorViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/authors/        -> list
        POST   /api/comics/authors/        -> create
        GET    /api/comics/authors/<pk>/   -> retrieve
        PUT    /api/comics/authors/<pk>/   -> update
        PATCH  /api/comics/authors/<pk>/   -> partial_update
        DELETE /api/comics/authors/<pk>/   -> destroy
    """
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        book_count = Book.objects.filter(authors=instance).count()
        if book_count:
            return Response(
                {'error': f'Cannot delete: {book_count} book(s) reference this author.'},
                status=status.HTTP_409_CONFLICT,
            )

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this author.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class ArtistViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/artists/        -> list
        POST   /api/comics/artists/        -> create
        GET    /api/comics/artists/<pk>/   -> retrieve
        PUT    /api/comics/artists/<pk>/   -> update
        PATCH  /api/comics/artists/<pk>/   -> partial_update
        DELETE /api/comics/artists/<pk>/   -> destroy
    """
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        book_count = Book.objects.filter(artists=instance).count()
        if book_count:
            return Response(
                {'error': f'Cannot delete: {book_count} book(s) reference this artist.'},
                status=status.HTTP_409_CONFLICT,
            )

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this artist.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class FormatViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/formats/        -> list
        POST   /api/comics/formats/        -> create
        GET    /api/comics/formats/<pk>/   -> retrieve
        PUT    /api/comics/formats/<pk>/   -> update
        PATCH  /api/comics/formats/<pk>/   -> partial_update
        DELETE /api/comics/formats/<pk>/   -> destroy
    """
    queryset = Format.objects.all()
    serializer_class = FormatSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this format.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class SubCategoryViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/sub-categories/        -> list
        POST   /api/comics/sub-categories/        -> create
        GET    /api/comics/sub-categories/<pk>/   -> retrieve
        PUT    /api/comics/sub-categories/<pk>/   -> update
        PATCH  /api/comics/sub-categories/<pk>/   -> partial_update
        DELETE /api/comics/sub-categories/<pk>/   -> destroy
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this sub category.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

class TeamViewSet(viewsets.ModelViewSet):
    """
        GET    /api/comics/teams/        -> list
        POST   /api/comics/teams/        -> create
        GET    /api/comics/teams/<pk>/   -> retrieve
        PUT    /api/comics/teams/<pk>/   -> update
        PATCH  /api/comics/teams/<pk>/   -> partial_update
        DELETE /api/comics/teams/<pk>/   -> destroy
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            instance.delete()
        except ProtectedError as e:
            blocking_count = len(e.protected_objects)
            return Response(
                {'error': f'Cannot delete: {blocking_count} record(s) reference this team.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
