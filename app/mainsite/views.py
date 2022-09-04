from django.contrib.auth import authenticate, login, logout
from http.client import HTTPResponse
from django.shortcuts import render
from rest_framework import generics
from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from .serializers import RoomSerializer
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

def main_site(request):
    return render(request, "mainsite.html")

@csrf_exempt
def dunneweb_login(request):
    print('This is a login attemp')
    if request.user.is_authenticated:
        return JsonResponse({'success': 'true'})

    req = json.loads(request.body)
    if not req:
        return JsonResponse({'success': 'false'})

    username = req.get('username', None)
    password = req.get('password', None)
    if not username or not password:
        return JsonResponse({'success': 'false'})

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'success': 'true'})
    else:
        # Return an 'invalid login' error message.
        print('not a valid user')
        return JsonResponse({
            'success': 'false',
            'error': 'invalid user'
        })


    

@csrf_exempt
@login_required(login_url='/api/login')
def dunneweb_logout(request):
    print('This is a logout attemp')
    req = json.loads(request.body)
    logout(request)

    return JsonResponse({'success': 'true'})


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
        'success': 'true',
        'data': data
    })