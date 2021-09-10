from django.shortcuts import render
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

def main_site(request):
    return render(request, "mainsite.html")