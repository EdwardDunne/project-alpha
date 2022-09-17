from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .utils import get_hash_for_marvel_api
import time
import hashlib
import requests
import json

def main_site(request):
    return render(request, "mainsite.html")

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