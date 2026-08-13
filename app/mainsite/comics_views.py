import logging

from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from mainsite.models import Artist, Author, Book, Character, Format, Publisher, SubCategory, Team
from .serializers import ArtistSerializer, AuthorSerializer, BookSerializer, CharacterSerializer, FormatSerializer, PublisherSerializer, SubCategorySerializer, TeamSerializer
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
            if not request.user.is_staff:
                cached = cache.get('all_books')
                if cached is not None:
                    return Response({'success': 'true', 'books': cached})

            # select_related/prefetch_related all foriegn keys
            books = Book.objects.select_related(
                'publisher', 'format', 'sub_category', 'team'
            ).prefetch_related('characters', 'authors', 'artists')
            all_books = BookSerializer(books, many=True).data

            if not request.user.is_staff:
                cache.set('all_books', all_books, CACHE_TTL)

            return Response({'success': 'true', 'books': all_books})
        except Exception as e:
            logger.exception('Something went wrong when retrieving books: %s', e)
            return Response({'error': 'Something went wrong when retrieving books.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = BookSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Book creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_book = serializer.save()
            cache.delete('all_books')
            return Response({'success': 'true', 'new_book': BookSerializer(new_book).data}, status=status.HTTP_201_CREATED)

        # Book thumbnail url example
        # http://localhost:8000/media/uploads/book-thumbnails/comics-hex-img.jpg

        except Exception as e:
            logger.exception('Something went wrong when adding new book: %s', e)
            return Response({'error': 'Something went wrong when adding new book.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data.copy()
            # Users can clear these fields by removing all the 
            # attached objects. This section gives the serializer
            # the empty list necessary to validate this change
            if 'authors' not in data:
                data.setlist('authors', [])
            if 'artists' not in data:
                data.setlist('artists', [])
            if 'characters' not in data:
                data.setlist('characters', [])

            try:
                book_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                book = Book.objects.get(id=book_id)
            except Book.DoesNotExist:
                return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = BookSerializer(book, data=data, partial=True)
            if not serializer.is_valid():
                logger.warning('Book update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_book = serializer.save()
            cache.delete('all_books')
            return Response({'success': 'true', 'new_book': BookSerializer(updated_book).data})

        except Exception as e:
            logger.exception('Something went wrong when updating the book: %s', e)
            return Response({'error': 'Something went wrong when updating the book.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                book_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                book = Book.objects.get(id=book_id)
            except Book.DoesNotExist:
                return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

            book.delete()
            cache.delete('all_books')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting the book: %s', e)
            return Response({'error': 'Something went wrong when deleting the book.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CharacterView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_characters = cache.get('all_characters')
                if cached_characters is not None:
                    return Response({'success': 'true', 'characters': cached_characters})

            all_characters = [
                CharacterSerializer(character).data for character in Character.objects.all()]

            if not request.user.is_staff:
                cache.set('all_characters', all_characters, CACHE_TTL)

            return Response({'success': 'true', 'characters': all_characters})
        except Exception as e:
            logger.exception('Something went wrong when retrieving characters: %s', e)
            return Response({'error': 'Something went wrong when retrieving characters.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = CharacterSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Character creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_character = serializer.save()
            cache.delete('all_characters')
            return Response({'success': 'true', 'new_character': CharacterSerializer(new_character).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating character: %s', e)
            return Response({'error': 'Something went wrong when creating character.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                character_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                character = Character.objects.get(id=character_id)
            except Character.DoesNotExist:
                return Response({'error': 'Character not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = CharacterSerializer(character, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Character update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_character = serializer.save()
            cache.delete('all_characters')
            return Response({'success': 'true', 'new_character': CharacterSerializer(updated_character).data})
        except Exception as e:
            logger.exception('Something went wrong when updating character: %s', e)
            return Response({'error': 'Something went wrong when updating character.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                character_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                character = Character.objects.get(id=character_id)
            except Character.DoesNotExist:
                return Response({'error': 'Character not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(characters=character).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this character.'}, status=status.HTTP_409_CONFLICT)

            character.delete()
            cache.delete('all_characters')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting character: %s', e)
            return Response({'error': 'Something went wrong when deleting character.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PublisherView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_publishers = cache.get('all_publishers')
                if cached_publishers is not None:
                    return Response({'success': 'true', 'publishers': cached_publishers})

            all_publishers = [
                PublisherSerializer(publisher).data for publisher in Publisher.objects.all()]

            if not request.user.is_staff:
                cache.set('all_publishers', all_publishers, CACHE_TTL)

            return Response({'success': 'true', 'publishers': all_publishers})
        except Exception as e:
            logger.exception('Something went wrong when retrieving publishers: %s', e)
            return Response({'error': 'Something went wrong when retrieving publishers.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = PublisherSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Publisher creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_publisher = serializer.save()
            cache.delete('all_publishers')
            return Response({'success': 'true', 'new_publisher': PublisherSerializer(new_publisher).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating publisher: %s', e)
            return Response({'error': 'Something went wrong when creating publisher.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                publisher_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                publisher = Publisher.objects.get(id=publisher_id)
            except Publisher.DoesNotExist:
                return Response({'error': 'Publisher not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = PublisherSerializer(publisher, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Publisher update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_publisher = serializer.save()
            cache.delete('all_publishers')
            return Response({'success': 'true', 'new_publisher': PublisherSerializer(updated_publisher).data})
        except Exception as e:
            logger.exception('Something went wrong when updating publisher: %s', e)
            return Response({'error': 'Something went wrong when updating publisher.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                publisher_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                publisher = Publisher.objects.get(id=publisher_id)
            except Publisher.DoesNotExist:
                return Response({'error': 'Publisher not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(publisher=publisher).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this publisher.'}, status=status.HTTP_409_CONFLICT)

            publisher.delete()
            cache.delete('all_publishers')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting publisher: %s', e)
            return Response({'error': 'Something went wrong when deleting publisher.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AuthorView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_authors = cache.get('all_authors')
                if cached_authors is not None:
                    return Response({'success': 'true', 'authors': cached_authors})

            all_authors = [
                AuthorSerializer(author).data for author in Author.objects.all()]

            if not request.user.is_staff:
                cache.set('all_authors', all_authors, CACHE_TTL)

            return Response({'success': 'true', 'authors': all_authors})
        except Exception as e:
            logger.exception('Something went wrong when retrieving authors: %s', e)
            return Response({'error': 'Something went wrong when retrieving authors.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = AuthorSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Author creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_author = serializer.save()
            cache.delete('all_authors')
            return Response({'success': 'true', 'new_author': AuthorSerializer(new_author).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating author: %s', e)
            return Response({'error': 'Something went wrong when creating author.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                author_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                author = Author.objects.get(id=author_id)
            except Author.DoesNotExist:
                return Response({'error': 'Author not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = AuthorSerializer(author, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Author update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_author = serializer.save()
            cache.delete('all_authors')
            return Response({'success': 'true', 'new_author': AuthorSerializer(updated_author).data})
        except Exception as e:
            logger.exception('Something went wrong when updating author: %s', e)
            return Response({'error': 'Something went wrong when updating author.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                author_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                author = Author.objects.get(id=author_id)
            except Author.DoesNotExist:
                return Response({'error': 'Author not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(authors=author).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this author.'}, status=status.HTTP_409_CONFLICT)

            author.delete()
            cache.delete('all_authors')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting author: %s', e)
            return Response({'error': 'Something went wrong when deleting author.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ArtistView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_artists = cache.get('all_artists')
                if cached_artists is not None:
                    return Response({'success': 'true', 'artists': cached_artists})

            all_artists = [
                ArtistSerializer(artist).data for artist in Artist.objects.all()]

            if not request.user.is_staff:
                cache.set('all_artists', all_artists, CACHE_TTL)

            return Response({'success': 'true', 'artists': all_artists})
        except Exception as e:
            logger.exception('Something went wrong when retrieving artists: %s', e)
            return Response({'error': 'Something went wrong when retrieving artists.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = ArtistSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Artist creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_artist = serializer.save()
            cache.delete('all_artists')
            return Response({'success': 'true', 'new_artist': ArtistSerializer(new_artist).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating artist: %s', e)
            return Response({'error': 'Something went wrong when creating artist.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                artist_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                artist = Artist.objects.get(id=artist_id)
            except Artist.DoesNotExist:
                return Response({'error': 'Artist not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = ArtistSerializer(artist, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Artist update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_artist = serializer.save()
            cache.delete('all_artists')
            return Response({'success': 'true', 'new_artist': ArtistSerializer(updated_artist).data})
        except Exception as e:
            logger.exception('Something went wrong when updating artist: %s', e)
            return Response({'error': 'Something went wrong when updating artist.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                artist_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                artist = Artist.objects.get(id=artist_id)
            except Artist.DoesNotExist:
                return Response({'error': 'Artist not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(artists=artist).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this artist.'}, status=status.HTTP_409_CONFLICT)

            artist.delete()
            cache.delete('all_artists')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting artist: %s', e)
            return Response({'error': 'Something went wrong when deleting artist.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FormatView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_formats = cache.get('all_formats')
                if cached_formats is not None:
                    return Response({'success': 'true', 'formats': cached_formats})

            all_formats = [
                FormatSerializer(fmt).data for fmt in Format.objects.all()]

            if not request.user.is_staff:
                cache.set('all_formats', all_formats, CACHE_TTL)

            return Response({'success': 'true', 'formats': all_formats})
        except Exception as e:
            logger.exception('Something went wrong when retrieving formats: %s', e)
            return Response({'error': 'Something went wrong when retrieving formats.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = FormatSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Format creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_format = serializer.save()
            cache.delete('all_formats')
            return Response({'success': 'true', 'new_format': FormatSerializer(new_format).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating format: %s', e)
            return Response({'error': 'Something went wrong when creating format.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                fmt_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                fmt = Format.objects.get(id=fmt_id)
            except Format.DoesNotExist:
                return Response({'error': 'Format not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = FormatSerializer(fmt, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Format update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_format = serializer.save()
            cache.delete('all_formats')
            return Response({'success': 'true', 'new_format': FormatSerializer(updated_format).data})
        except Exception as e:
            logger.exception('Something went wrong when updating format: %s', e)
            return Response({'error': 'Something went wrong when updating format.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                fmt_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                fmt = Format.objects.get(id=fmt_id)
            except Format.DoesNotExist:
                return Response({'error': 'Format not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(format=fmt).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this format.'}, status=status.HTTP_409_CONFLICT)

            fmt.delete()
            cache.delete('all_formats')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting format: %s', e)
            return Response({'error': 'Something went wrong when deleting format.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubCategoryView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_sub_categories = cache.get('all_sub_categories')
                if cached_sub_categories is not None:
                    return Response({'success': 'true', 'sub_categories': cached_sub_categories})

            all_sub_categories = [
                SubCategorySerializer(sub_category).data for sub_category in SubCategory.objects.all()]

            if not request.user.is_staff:
                cache.set('all_sub_categories', all_sub_categories, CACHE_TTL)

            return Response({'success': 'true', 'sub_categories': all_sub_categories})
        except Exception as e:
            logger.exception('Something went wrong when retrieving sub categories: %s', e)
            return Response({'error': 'Something went wrong when retrieving sub categories.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = SubCategorySerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Sub category creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_sub_category = serializer.save()
            cache.delete('all_sub_categories')
            return Response({'success': 'true', 'new_sub_category': SubCategorySerializer(new_sub_category).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating sub category: %s', e)
            return Response({'error': 'Something went wrong when creating sub category.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                sub_category_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                sub_category = SubCategory.objects.get(id=sub_category_id)
            except SubCategory.DoesNotExist:
                return Response({'error': 'Sub category not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = SubCategorySerializer(sub_category, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Sub category update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_sub_category = serializer.save()
            cache.delete('all_sub_categories')
            return Response({'success': 'true', 'new_sub_category': SubCategorySerializer(updated_sub_category).data})
        except Exception as e:
            logger.exception('Something went wrong when updating sub category: %s', e)
            return Response({'error': 'Something went wrong when updating sub category.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                sub_category_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                sub_category = SubCategory.objects.get(id=sub_category_id)
            except SubCategory.DoesNotExist:
                return Response({'error': 'Sub category not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(sub_category=sub_category).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this sub category.'}, status=status.HTTP_409_CONFLICT)

            sub_category.delete()
            cache.delete('all_sub_categories')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting sub category: %s', e)
            return Response({'error': 'Something went wrong when deleting sub category.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeamView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request, format=None):
        try:
            if not request.user.is_staff:
                cached_teams = cache.get('all_teams')
                if cached_teams is not None:
                    return Response({'success': 'true', 'teams': cached_teams})

            all_teams = [
                TeamSerializer(team).data for team in Team.objects.all()]

            if not request.user.is_staff:
                cache.set('all_teams', all_teams, CACHE_TTL)

            return Response({'success': 'true', 'teams': all_teams})
        except Exception as e:
            logger.exception('Something went wrong when retrieving teams: %s', e)
            return Response({'error': 'Something went wrong when retrieving teams.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, format=None):
        try:
            serializer = TeamSerializer(data=request.data)
            if not serializer.is_valid():
                logger.warning('Team creation failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            new_team = serializer.save()
            cache.delete('all_teams')
            return Response({'success': 'true', 'new_team': TeamSerializer(new_team).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong when creating team: %s', e)
            return Response({'error': 'Something went wrong when creating team.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            data = self.request.data
            try:
                team_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                team = Team.objects.get(id=team_id)
            except Team.DoesNotExist:
                return Response({'error': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

            serializer = TeamSerializer(team, data=request.data, partial=True)
            if not serializer.is_valid():
                logger.warning('Team update failed validation: %s', serializer.errors)
                return Response({'error': serializer_error_message(serializer)}, status=status.HTTP_400_BAD_REQUEST)

            updated_team = serializer.save()
            cache.delete('all_teams')
            return Response({'success': 'true', 'new_team': TeamSerializer(updated_team).data})
        except Exception as e:
            logger.exception('Something went wrong when updating team: %s', e)
            return Response({'error': 'Something went wrong when updating team.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, format=None):
        try:
            data = self.request.data
            try:
                team_id = data['id']
            except KeyError:
                return Response({'error': 'Missing required field: id.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                team = Team.objects.get(id=team_id)
            except Team.DoesNotExist:
                return Response({'error': 'Team not found.'}, status=status.HTTP_404_NOT_FOUND)

            book_count = Book.objects.filter(team=team).count()
            if book_count:
                return Response({'error': f'Cannot delete: {book_count} book(s) reference this team.'}, status=status.HTTP_409_CONFLICT)

            team.delete()
            cache.delete('all_teams')
            return Response({'success': 'true'})
        except Exception as e:
            logger.exception('Something went wrong when deleting team: %s', e)
            return Response({'error': 'Something went wrong when deleting team.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
