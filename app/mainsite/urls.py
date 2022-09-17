from django.urls import path, include
from .views import dunneweb_login, dunneweb_logout, get_marvel_omnibuses, test_marvel_api

urlpatterns = [
    path('login', dunneweb_login),
    path('logout', dunneweb_logout),
    path('test-marvel', test_marvel_api),
    path('get-marvel-omnis', get_marvel_omnibuses)
]