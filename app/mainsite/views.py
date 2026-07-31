import logging

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib import auth
from django.contrib.auth.models import User
from mainsite.models import Author, Book, Character, Publisher, UserProfile
from .serializers import AuthorSerializer, BookSerializer, CharacterSerializer, PublisherSerializer, UserSerializer, UserProfileSerializer

logger = logging.getLogger(__name__)

CACHE_TTL = 60 * 60 * 24  # 24 hours


def serializer_error_message(serializer):
    return '; '.join(
        f"{field}: {' '.join(str(message) for message in messages)}"
        for field, messages in serializer.errors.items()
    )


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})

class CheckAuthenticatedView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            isAuthenticated = request.user.is_authenticated

            if isAuthenticated:
                user = request.user
                user = User.objects.get(id=user.id)
                return Response({'isAuthenticated': 'success', 'is_staff': user.is_staff})
            else:
                return Response({'isAuthenticated': 'error'})
        except Exception as e:
            logger.exception('Something went wrong with checking authentication: %s', e)
            return Response({'error': f'Something went wrong with checking authentication: {str(e)}'})

@method_decorator(csrf_protect, name='dispatch')
class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data
            email = data['email']

            user = User.objects.filter(email__iexact=email).first()

            if user is not None and user.is_active:
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                reset_url = request.build_absolute_uri(f'/reset-password/{uidb64}/{token}')

                send_mail(
                    subject='Reset your Omni Trackers password',
                    message=f'Click the link below to reset your password:\n\n{reset_url}\n\nIf you did not request this, you can ignore this email.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                )

            # Always report success, whether or not the email is registered,
            # so this endpoint can't be used to enumerate accounts.
            return Response({'success': 'If an account exists for that email, a reset link has been sent'})
        except Exception as e:
            logger.exception('Something went wrong when requesting a password reset: %s', e)
            return Response({'error': f'Something went wrong when requesting a password reset: {str(e)}'})

@method_decorator(csrf_protect, name='dispatch')
class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data

            uidb64 = data['uidb64']
            token = data['token']
            password = data['password']
            re_password = data['re_password']

            if password != re_password:
                return Response({'error': 'Passwords do not match'})

            if len(password) < 6:
                return Response({'error': 'Password must be at least 6 characters'})

            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.filter(pk=uid).first()

            if user is None or not default_token_generator.check_token(user, token):
                return Response({'error': 'This password reset link is invalid or has expired'})

            user.set_password(password)
            user.save()

            return Response({'success': 'Password has been reset successfully'})
        except Exception as e:
            logger.exception('Something went wrong when resetting password: %s', e)
            return Response({'error': f'Something went wrong when resetting your password: {str(e)}'})

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data

            email = data['email']
            password = data['password']

            existing_user = User.objects.filter(email__iexact=email).first()

            if existing_user is None:
                return Response({ 'error': 'No account found with that email' })

            if not existing_user.is_active:
                return Response({ 'error': 'This account is inactive' })

            user = auth.authenticate(username=existing_user.username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({ 'success': 'User Authenticated' })
            else:
                return Response({ 'error': 'Incorrect password' })
        except Exception as e:
            logger.exception('Something went wrong when logging in: %s', e)
            return Response({ 'error': f'Something went wrong when logging in: {str(e)}' })

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Logged Out' })
        except Exception as e:
            logger.exception('Something went wrong when logging out: %s', e)
            return Response({ 'error': f'Something went wrong when logging out: {str(e)}' })

@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data

            email = data['email']
            password = data['password']
            re_password = data['re_password']

            if password == re_password:
                if User.objects.filter(email__iexact=email).exists():
                    return Response({'error':'An account with that email already exists'})
                else:
                    if len(password) < 6:
                        return Response({'error':'Password must be at least 6 characters'})
                    else:
                        user = User.objects.create_user(username=email, email=email, password=password)
                        user = User.objects.get(id=user.id)
                        UserProfile.objects.create(user=user, first_name='', last_name='', email=email)

                        return Response({'success': 'User created successfully'})
            else:
                return Response({'error':'Passwords do not match'})
        except Exception as e:
            logger.exception('Something went wrong with registering account: %s', e)
            return Response({'error': f'Something went wrong with registering account: {str(e)}'})

class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()
            return Response({'success': 'User deleted successfully'})
        except Exception as e:
            logger.exception('Something went wrong when trying to delete user: %s', e)
            return Response({'error': f'Something went wrong when trying to delete user: {str(e)}'})

class GetUsersView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        users = User.objects.all()
        users = UserSerializer(users, many=True)

        return Response(users.data)

class UserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        try:
            user = self.request.user
            user = User.objects.get(id=user.id)

            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)

            return Response({
                'profile': user_profile.data,
                'is_staff': user.is_staff})
        except Exception as e:
            logger.exception('Something went wrong when retrieving user profile: %s', e)
            return Response({'error': f'Something went wrong when retrieving user profile: {str(e)}'})

    def put(self, request, format=None):
        try:
            user = self.request.user

            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']

            user = User.objects.get(id=user.id)
            UserProfile.objects.get_or_create(user=user)
            UserProfile.objects.filter(user=user).update(
                first_name=first_name,
                last_name=last_name
            )

            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)
            return Response({'profile': user_profile.data})
        except Exception as e:
            logger.exception('Something went wrong when updating user profile: %s', e)
            return Response({'error': f'Something went wrong when updating user profile: {str(e)}'})

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
                all_characters = [
                    CharacterSerializer(character).data for character in Character.objects.all()]
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
                all_publishers = [
                    PublisherSerializer(publisher).data for publisher in Publisher.objects.all()]
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
                all_authors = [
                    AuthorSerializer(author).data for author in Author.objects.all()]
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
