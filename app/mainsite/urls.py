from django.urls import path, include
from .views import dunneweb_login, dunneweb_logout, test_view, test_marvel_api

urlpatterns = [
    path('login', dunneweb_login),
    path('logout', dunneweb_logout),
    path('test-marvel', test_marvel_api),
    path('test-view', test_view)
]