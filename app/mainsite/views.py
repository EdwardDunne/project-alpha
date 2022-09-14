from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
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
    ts = time.time()
    public_key = 'fd5bebe5ddaf4f55674f77786602fb94'
    private_key = 'fd2ca66abb1e674e35ee6a2f3bbbb50a5a9b6456'
    hash = hashlib.md5('{}{}{}'.format(ts, private_key, public_key).encode()).hexdigest()

    headers = {
        'Accept': '*/*'
    }
    url = 'http://gateway.marvel.com/v1/public/comics?ts={}&apikey={}&hash={}'.format(ts, public_key, hash)

    response = requests.get(url, headers=headers)
    res_data = response.json()

    print(res_data)

    return JsonResponse({
        'success': True,
        'data': res_data
    })

@csrf_exempt
@login_required
def test_view(request):
    data = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4'
    }
    return JsonResponse({
        'success': True,
        'data': data
    })