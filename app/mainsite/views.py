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
from mainsite.models import Book, Character, Publisher, UserProfile
from .serializers import BookSerializer, CharacterSerializer, PublisherSerializer, UserSerializer, UserProfileSerializer

CACHE_TTL = 60 * 60 * 24  # 24 hours


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
        except:
            return Response({'error':'Something went wrong with checking authentication'})

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        email = data['email']
        password = data['password']

        try:
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
        except:
            return Response({ 'error': 'Something went wrong when logging in' })


@method_decorator(csrf_protect, name='dispatch')
class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        email = data['email']

        try:
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
        except:
            return Response({'error': 'Something went wrong when requesting a password reset'})

@method_decorator(csrf_protect, name='dispatch')
class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        uidb64 = data['uidb64']
        token = data['token']
        password = data['password']
        re_password = data['re_password']

        try:
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
        except:
            return Response({'error': 'Something went wrong when resetting your password'})

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Logged Out' })
        except:
            return Response({ 'error': 'Something went wrong when logging out' })

@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        email = data['email']
        password = data['password']
        re_password = data['re_password']

        try:
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
        except:
            return Response({'error':'Something went wrong with registering account'})

class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()
            return Response({'success': 'User deleted successfully'})
        except:
            return Response({'error': 'Something went wrong when trying to delete user'})

class GetUsersView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        users = User.objects.all()
        users = UserSerializer(users, many=True)

        return Response(users.data)

class GetUserProfileView(APIView):
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
        except:
            return Response({'error': 'Something went wrong when retrieving user profile'})

class UpdateUserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

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
            print(e)
            return Response({'error': 'Something went wrong when updating user profile'})

class BookView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            data = self.request.data
            new_book = Book.objects.create(
                title=data['title'],
                author=data['author'],
                description=data['description'],
                page_count=data['page_count'],
                thumbnail=request.FILES['thumbnail'],
                publisher=Publisher.objects.get(key=data['publisher']),
                character=Character.objects.get(id=data['character'])
            )
            new_book = BookSerializer(new_book)
            return Response({'success': 'true', 'new_book': new_book.data})
        
        # Book thumbnail url example
        # http://localhost:8000/media/uploads/book-thumbnails/comics-hex-img.jpg

        except:
            return Response({'error': 'Something went wrong when updating books'})
        
class GetBooksView(APIView):
    permission_classes = (permissions.AllowAny, )

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
        except:
            return Response({'error': 'Something went wrong when updating publishers'})
        
class CharacterView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            data = self.request.data
            new_character = Character.objects.create(
                name=data['name'], 
                publisher=Publisher.objects.get(key=data['publisher'])
            )
            new_character = CharacterSerializer(new_character)
            return Response({'success': 'true', 'new_character': new_character.data})
        except:
            return Response({'error': 'Something went wrong when updating publishers'})

class GetCharactersView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all':
                all_characters = [
                    CharacterSerializer(character).data for character in Character.objects.all()]
                return Response({'success': 'true', 'characters': all_characters})
            
            return Response({'error': 'no action'})
        except:
            return Response({'error': 'Something went wrong when updating publishers'})
        
class PublisherView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            data = self.request.data
            new_publisher = Publisher.objects.create(
                key=data['key'], 
                name=data['name']
            )
            new_publisher = PublisherSerializer(new_publisher)
            return Response({'success': 'true', 'new_publisher': new_publisher.data})
        except:
            return Response({'error': 'Something went wrong when updating publishers'})
        
class GetPublishersView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        try:
            data = self.request.query_params
            action = data['action']

            if action == 'get_all':
                all_publishers = [
                    PublisherSerializer(publisher).data for publisher in Publisher.objects.all()]
                return Response({'success': 'true', 'publishers': all_publishers})
            
            return Response({'error': 'no action'})
        except:
            return Response({'error': 'Something went wrong when updating publishers'})