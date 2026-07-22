from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('comics-admin', index),
    path('login', index),
    path('register', index),
    path('forgot-password', index),
    path('reset-password/<str:uidb64>/<str:token>', index),
    path('dashboard', index),
    path('comics', index),
    path('about', index),
    path('changelog', index)
]