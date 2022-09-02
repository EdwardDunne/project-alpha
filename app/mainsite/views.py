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
# from .models import Room

# class RoomView(generics.ListAPIView):
#     queryset = Room.objects.all()
#     serializer_class = RoomSerializer

def main_site(request):
    return render(request, "mainsite.html")

@csrf_exempt
def dunneweb_login(request):
    print('This is a login attemp')
    req = json.loads(request.body)

    print(request.user.is_authenticated)

    username = req.get('username')
    password = req.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.
        return JsonResponse({'resp': 'LOGIN SUCCESS!'})
    else:
        # Return an 'invalid login' error message.
        print('not a valid user')
        return JsonResponse({'resp': 'LOGIN FAILURE!'})


    

@csrf_exempt
def dunneweb_logout(request):
    print('This is a logout attemp')
    req = json.loads(request.body)
    logout(request)

    return JsonResponse({'resp': 'LOGOUT SUCCESS!'})



@login_required
def test_view(request):
    return JsonResponse({'resp': 'TEST VIEW SUCCESS!'})