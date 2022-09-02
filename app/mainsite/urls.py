from django.urls import path, include
from .views import dunneweb_login, dunneweb_logout, test_view

urlpatterns = [
    path('login', dunneweb_login),
    path('logout', dunneweb_logout),
    path('test-view', test_view)
]