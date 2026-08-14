import logging

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib import auth
from django.contrib.auth.models import User
from mainsite.models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer

logger = logging.getLogger(__name__)


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
            return Response({'error': 'Something went wrong with checking authentication.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

            return Response({'success': 'If an account exists for that email, a reset link has been sent'})
        except KeyError:
            return Response({'error': 'Missing required field: email.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception('Something went wrong when requesting a password reset: %s', e)
            return Response({'error': 'Something went wrong when requesting a password reset.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_protect, name='dispatch')
class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data

            try:
                uidb64 = data['uidb64']
                token = data['token']
                password = data['password']
                re_password = data['re_password']
            except KeyError as e:
                return Response({'error': f'Missing required field: {e.args[0]}.'}, status=status.HTTP_400_BAD_REQUEST)

            if password != re_password:
                return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

            if len(password) < 6:
                return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)

            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.filter(pk=uid).first()

            if user is None or not default_token_generator.check_token(user, token):
                return Response({'error': 'This password reset link is invalid or has expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(password)
            user.save()

            return Response({'success': 'Password has been reset successfully'})
        except Exception as e:
            logger.exception('Something went wrong when resetting password: %s', e)
            return Response({'error': 'Something went wrong when resetting your password.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data

            try:
                email = data['email']
                password = data['password']
            except KeyError as e:
                return Response({'error': f'Missing required field: {e.args[0]}.'}, status=status.HTTP_400_BAD_REQUEST)

            existing_user = User.objects.filter(email__iexact=email).first()

            if existing_user is None:
                return Response({'error': 'No account found with that email'}, status=status.HTTP_401_UNAUTHORIZED)

            if not existing_user.is_active:
                return Response({'error': 'This account is inactive'}, status=status.HTTP_403_FORBIDDEN)

            user = auth.authenticate(username=existing_user.username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({'success': 'User Authenticated'})
            else:
                return Response({'error': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.exception('Something went wrong when logging in: %s', e)
            return Response({'error': 'Something went wrong when logging in.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'Logged Out'})
        except Exception as e:
            logger.exception('Something went wrong when logging out: %s', e)
            return Response({'error': 'Something went wrong when logging out.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            data = self.request.data

            try:
                email = data['email']
                password = data['password']
                re_password = data['re_password']
            except KeyError as e:
                return Response({'error': f'Missing required field: {e.args[0]}.'}, status=status.HTTP_400_BAD_REQUEST)

            if password != re_password:
                return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email__iexact=email).exists():
                return Response({'error': 'An account with that email already exists'}, status=status.HTTP_409_CONFLICT)

            if len(password) < 6:
                return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=email, email=email, password=password)
            user = User.objects.get(id=user.id)
            UserProfile.objects.create(user=user, first_name='', last_name='')

            return Response({'success': 'User created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception('Something went wrong with registering account: %s', e)
            return Response({'error': 'Something went wrong with registering account.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = self.request.user

        try:
            User.objects.filter(id=user.id).delete()
            return Response({'success': 'User deleted successfully'})
        except Exception as e:
            logger.exception('Something went wrong when trying to delete user: %s', e)
            return Response({'error': 'Something went wrong when trying to delete user.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            return Response({'error': 'Something went wrong when retrieving user profile.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, format=None):
        try:
            user = self.request.user

            data = self.request.data
            try:
                first_name = data['first_name']
                last_name = data['last_name']
            except KeyError as e:
                return Response({'error': f'Missing required field: {e.args[0]}.'}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({'error': 'Something went wrong when updating user profile.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
