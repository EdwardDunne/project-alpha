from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib import auth
from .utils import get_hash_for_marvel_api
from django.contrib.auth.models import User
from mainsite.models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer
import time
import requests
import json

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})

class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        try:
            isAuthenticated = request.user.is_authenticated

            if isAuthenticated:
                return Response({'isAuthenticated': 'success'})
            else:
                return Response({'isAuthenticated': 'error'})
        except:
            return Response({'error':'Something went wrong with checking authentication'})

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({ 'success': 'User Authenticated' })
            else:
                return Response({ 'error': 'Error Authentiocating' })
        except:
            return Response({ 'error': 'Something went wrong when logging in' })


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

        username = data['username']
        password = data['password']
        re_password = data['re_password']

        try:
            if password == re_password:
                if User.objects.filter(username=username).exists():
                    return Response({'error':'Username already exists'})
                else:
                    if len(password) < 6:
                        return Response({'error':'Password must be at least 6 characters'})
                    else:
                        user = User.objects.create_user(username=username, password=password)
                        user = User.objects.get(id=user.id)
                        UserProfile.objects.create(user=user, first_name='', last_name='', email='')

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
                'username': str(user.username), 
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
            email = data['email']

            user = User.objects.get(id=user.id)
            UserProfile.objects.filter(user=user).update(
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            
            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)
            return Response({'profile': user_profile.data, 'username': str(user.username)})
        except:
            return Response({'error': 'Something went wrong when updating user profile'})

class TestMarvelApi(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        try:
            timestamp = time.time()
            headers = { 'Accept': '*/*' }
            url = 'http://gateway.marvel.com/v1/public/comics'
            payload = {
                'ts': timestamp,
                'apikey': settings.MARVEL_API_PUBLIC_KEY,
                'hash': get_hash_for_marvel_api(timestamp)
            }

            response = requests.get(url, headers=headers, params=payload)
            res_data = response.json()

            print(res_data)

            return Response({
                'success': True,
                'data': res_data
            })

        except:
            return Response({'error':'Something went wrong with testing the Marvel Api'})

class MarvelOmnis(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        try:
            timestamp = time.time()
            headers = { 'Accept': '*/*' }
            url = 'http://gateway.marvel.com/v1/public/comics'
            payload = {
                'ts': timestamp,
                'apikey': settings.MARVEL_API_PUBLIC_KEY,
                'hash': get_hash_for_marvel_api(timestamp),
                'format': 'hardcover',
                'formatType': 'collection',
                'orderBy': 'title',
                'offset': 20
            }

            response = requests.get(url, headers=headers, params=payload)
            res_data = response.json()

            print(res_data['data']['total'])

            omnis = []
            for book in res_data['data']['results']:
                title = book['title']
                if 'omnibus' in title.lower() or book['pageCount'] > 500:
                    print(book['title'])
                    omnis.append(book)
                    if not book['isbn']:
                        print('MISSING ISBN')

            return Response({
                'success': True,
                'data': omnis
            })

        except:
            return Response({'error':'Something went wrong with testing the Marvel Api'})
