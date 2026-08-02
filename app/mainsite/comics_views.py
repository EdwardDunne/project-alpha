import logging

from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from mainsite.models import Artist, Author, Book, Character, Publisher
from .serializers import ArtistSerializer, AuthorSerializer, BookSerializer, CharacterSerializer, PublisherSerializer
from .utils import serializer_error_message

logger = logging.getLogger(__name__)

CACHE_TTL = 60 * 60 * 24  # 24 hours


class BookView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all_books':
                if not request.user.is_staff:
                    cached = cache.get('all_books')
                    if cached is not None:
                        return Response({'success': 'true', 'books': cached})

                all_books = [BookSerializer(book).data for book in Book.objects.all()]

                if not request.user.is_staff:
                    cache.set('all_books', all_books, CACHE_TTL)

                return Response({'success': 'true', 'books': all_books})

            return Response({'error': 'no action'})
        except Exception as e:
            logger.exception('Something went wrong when retrieving books: %s', e)
            return Response({'error': f'Something went wrong when retrieving books: {str(e)}'})

    def post(self, request, format=None):
        try:
            serializer = BookSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Book creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            new_book = serializer.save()
            return Response({'success': 'true', 'new_book': BookSerializer(new_book).data})

        # Book thumbnail url example
        # http://localhost:8000/media/uploads/book-thumbnails/comics-hex-img.jpg

        except Exception as e:
            logger.exception('Something went wrong when adding new book: %s', e)
            return Response({'error': f'Something went wrong when adding new book: {str(e)}'})

    def put(self, request, format=None):
        try:
            data = self.request.data.copy()
            # M2M fields with no selections send no entries at all in multipart
            # form data, so the key is absent rather than an empty list. DRF's
            # partial update then treats them as "not provided" and leaves the
            # existing relations untouched, so an empty selection must be made
            # explicit here to actually clear them.
            if 'authors' not in data:
                data.setlist('authors', [])
            if 'artists' not in data:
                data.setlist('artists', [])
            if 'characters' not in data:
                data.setlist('characters', [])

            book = Book.objects.get(id=data['id'])

            serializer = BookSerializer(book, data=data, partial=True)
            if not serializer.is_valid():
                logger.warning('Book update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            updated_book = serializer.save()
            return Response({'success': 'true', 'new_book': BookSerializer(updated_book).data})

        except Exception as e:
            logger.exception('Something went wrong when updating the book: %s', e)
            return Response({'error': f'Something went wrong when updating the book: {str(e)}'})

    def delete(self, request, format=None):
        try:
            data = self.request.data
            book = Book.objects.get(id=data['id'])
            book.delete()
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting the book: %s', e)
            return Response({'error': f'Something went wrong when deleting the book: {str(e)}'})

class CharacterView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all':
                if not request.user.is_staff:
                    cached_characters = cache.get('all_characters')
                    if cached_characters is not None:
                        return Response({'success': 'true', 'characters': cached_characters})

                all_characters = [
                    CharacterSerializer(character).data for character in Character.objects.all()]

                if not request.user.is_staff:
                    cache.set('all_characters', all_characters, CACHE_TTL)

                return Response({'success': 'true', 'characters': all_characters})

            return Response({'error': 'no action'})
        except Exception as e:
            logger.exception('Something went wrong when retrieving characters: %s', e)
            return Response({'error': f'Something went wrong when retrieving characters: {str(e)}'})

    def post(self, request, format=None):
        try:
            serializer = CharacterSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Character creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            new_character = serializer.save()
            return Response({'success': 'true', 'new_character': CharacterSerializer(new_character).data})
        except Exception as e:
            logger.exception('Something went wrong when creating character: %s', e)
            return Response({'error': f'Something went wrong when creating character: {str(e)}'})

    def put(self, request, format=None):
        try:
            data = self.request.data
            character = Character.objects.get(id=data['id'])

            serializer = CharacterSerializer(character, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Character update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            updated_character = serializer.save()
            return Response({'success': 'true', 'new_character': CharacterSerializer(updated_character).data})
        except Exception as e:
            logger.exception('Something went wrong when updating character: %s', e)
            return Response({'error': f'Something went wrong when updating character: {str(e)}'})

    def delete(self, request, format=None):
        try:
            data = self.request.data
            character = Character.objects.get(id=data['id'])

            book_count = Book.objects.filter(characters=character).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this character.'})

            character.delete()
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting character: %s', e)
            return Response({'error': f'Something went wrong when deleting character: {str(e)}'})

class PublisherView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all':
                if not request.user.is_staff:
                    cached_publishers = cache.get('all_publishers')
                    if cached_publishers is not None:
                        return Response({'success': 'true', 'publishers': cached_publishers})

                all_publishers = [
                    PublisherSerializer(publisher).data for publisher in Publisher.objects.all()]

                if not request.user.is_staff:
                    cache.set('all_publishers', all_publishers, CACHE_TTL)

                return Response({'success': 'true', 'publishers': all_publishers})

            return Response({'error': 'no action'})
        except Exception as e:
            logger.exception('Something went wrong when retrieving publishers: %s', e)
            return Response({'error': f'Something went wrong when retrieving publishers: {str(e)}'})

    def post(self, request, format=None):
        try:
            serializer = PublisherSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Publisher creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            new_publisher = serializer.save()
            return Response({'success': 'true', 'new_publisher': PublisherSerializer(new_publisher).data})
        except Exception as e:
            logger.exception('Something went wrong when creating publisher: %s', e)
            return Response({'error': f'Something went wrong when creating publisher: {str(e)}'})

    def put(self, request, format=None):
        try:
            data = self.request.data
            publisher = Publisher.objects.get(id=data['id'])

            serializer = PublisherSerializer(publisher, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Publisher update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            updated_publisher = serializer.save()
            return Response({'success': 'true', 'new_publisher': PublisherSerializer(updated_publisher).data})
        except Exception as e:
            logger.exception('Something went wrong when updating publisher: %s', e)
            return Response({'error': f'Something went wrong when updating publisher: {str(e)}'})

    def delete(self, request, format=None):
        try:
            data = self.request.data
            publisher = Publisher.objects.get(id=data['id'])

            book_count = Book.objects.filter(publisher=publisher).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this publisher.'})

            publisher.delete()
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting publisher: %s', e)
            return Response({'error': f'Something went wrong when deleting publisher: {str(e)}'})

class AuthorView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all':
                if not request.user.is_staff:
                    cached_authors = cache.get('all_authors')
                    if cached_authors is not None:
                        return Response({'success': 'true', 'authors': cached_authors})

                all_authors = [
                    AuthorSerializer(author).data for author in Author.objects.all()]

                if not request.user.is_staff:
                    cache.set('all_authors', all_authors, CACHE_TTL)

                return Response({'success': 'true', 'authors': all_authors})

            return Response({'error': 'no action'})
        except Exception as e:
            logger.exception('Something went wrong when retrieving authors: %s', e)
            return Response({'error': f'Something went wrong when retrieving authors: {str(e)}'})

    def post(self, request, format=None):
        try:
            serializer = AuthorSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Author creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            new_author = serializer.save()
            return Response({'success': 'true', 'new_author': AuthorSerializer(new_author).data})
        except Exception as e:
            logger.exception('Something went wrong when creating author: %s', e)
            return Response({'error': f'Something went wrong when creating author: {str(e)}'})

    def put(self, request, format=None):
        try:
            data = self.request.data
            author = Author.objects.get(id=data['id'])

            serializer = AuthorSerializer(author, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Author update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            updated_author = serializer.save()
            return Response({'success': 'true', 'new_author': AuthorSerializer(updated_author).data})
        except Exception as e:
            logger.exception('Something went wrong when updating author: %s', e)
            return Response({'error': f'Something went wrong when updating author: {str(e)}'})

    def delete(self, request, format=None):
        try:
            data = self.request.data
            author = Author.objects.get(id=data['id'])

            book_count = Book.objects.filter(authors=author).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this author.'})

            author.delete()
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting author: %s', e)
            return Response({'error': f'Something went wrong when deleting author: {str(e)}'})

class ArtistView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all':
                if not request.user.is_staff:
                    cached_artists = cache.get('all_artists')
                    if cached_artists is not None:
                        return Response({'success': 'true', 'artists': cached_artists})

                all_artists = [
                    ArtistSerializer(artist).data for artist in Artist.objects.all()]

                if not request.user.is_staff:
                    cache.set('all_artists', all_artists, CACHE_TTL)

                return Response({'success': 'true', 'artists': all_artists})

            return Response({'error': 'no action'})
        except Exception as e:
            logger.exception('Something went wrong when retrieving artists: %s', e)
            return Response({'error': f'Something went wrong when retrieving artists: {str(e)}'})

    def post(self, request, format=None):
        try:
            serializer = ArtistSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Artist creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            new_artist = serializer.save()
            return Response({'success': 'true', 'new_artist': ArtistSerializer(new_artist).data})
        except Exception as e:
            logger.exception('Something went wrong when creating artist: %s', e)
            return Response({'error': f'Something went wrong when creating artist: {str(e)}'})

    def put(self, request, format=None):
        try:
            data = self.request.data
            artist = Artist.objects.get(id=data['id'])

            serializer = ArtistSerializer(artist, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Artist update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)})

            updated_artist = serializer.save()
            return Response({'success': 'true', 'new_artist': ArtistSerializer(updated_artist).data})
        except Exception as e:
            logger.exception('Something went wrong when updating artist: %s', e)
            return Response({'error': f'Something went wrong when updating artist: {str(e)}'})

    def delete(self, request, format=None):
        try:
            data = self.request.data
            artist = Artist.objects.get(id=data['id'])

            book_count = Book.objects.filter(artists=artist).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this artist.'})

            artist.delete()
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting artist: %s', e)
            return Response({'error': f'Something went wrong when deleting artist: {str(e)}'})
