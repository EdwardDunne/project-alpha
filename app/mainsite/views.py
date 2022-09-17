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
from .utils import get_hash_for_marvel_api
from django.contrib.auth.models import User
from mainsite.models import UserProfile
import time
import requests
import json



@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        re_password = data['re_password']

        if password == re_password:
            if User.objects.filter(username=username).exists():
                return Response({'error':'Username already exists'})
            else:
                if len(password) < 6:
                    return Response({'error':'Password must be at least 6 characters'})
                else:
                    user = User.objects.create_user(username=username, password=password)
                    user.save()
                    user = User.objects.get(username=username)

                    user_profile = UserProfile(user=user, first_name='', last_name='', email='')
                    user_profile.save()
                    return Response({'success': 'User created successfully'})
        else:
            return Response({'error':'Passwords do not match'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})

@csrf_exempt
def dunneweb_login(request):
    print('This is a login attemp')
    if request.user.is_authenticated:
        return JsonResponse({'success': True})

    req = json.loads(request.body)
    if not req:
        return JsonResponse({'success': False})

    username = req.get('username', None)
    password = req.get('password', None)
    if not username or not password:
        return JsonResponse({'success': False})

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'success': True})
    else:
        # Return an 'invalid login' error message.
        print('not a valid user')
        return JsonResponse({
            'success': False,
            'error': 'invalid user'
        }) 

@csrf_exempt
@login_required
def dunneweb_logout(request):
    print('This is a logout attemp')
    req = json.loads(request.body)
    logout(request)

    return JsonResponse({'success': True})

# Initial attemp to request data from the marvel api
@csrf_exempt
@login_required
def test_marvel_api(request):
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

    return JsonResponse({
        'success': True,
        'data': res_data
    })

@csrf_exempt
@login_required
def get_marvel_omnibuses(request):
    timestamp = time.time()
    headers = { 'Accept': '*/*' }
    url = 'http://gateway.marvel.com/v1/public/comics'
    payload = {
        'ts': timestamp,
        'apikey': settings.MARVEL_API_PUBLIC_KEY,
        'hash': get_hash_for_marvel_api(timestamp),
        'format': 'hardcover',
        'formatType': 'collection'
    }

    response = requests.get(url, headers=headers, params=payload)
    res_data = response.json()

    print(res_data['data']['total'])

    for book in res_data['data']['results']:
        title = book['title']
        if 'omnibus' in title.lower() or book['pageCount'] > 500:
            print(book['title'])

    return JsonResponse({
        'success': True,
        'data': res_data
    })