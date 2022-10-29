from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('admin-test', index),
    path('comics-admin', index),
    path('login', index),
    path('register', index),
    path('dashboard', index)
]