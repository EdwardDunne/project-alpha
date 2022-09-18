from django.urls import path, include
from .views import UpdateUserProfileView, dunneweb_login, dunneweb_logout, get_marvel_omnibuses, test_marvel_api, SignupView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, GetUsersView, GetUserProfileView

urlpatterns = [
    path('csrf-cookie', GetCSRFToken.as_view()),
    path('authenticated', CheckAuthenticatedView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('register', SignupView.as_view()),
    path('delete-account', DeleteAccountView.as_view()),
    path('get-users', GetUsersView.as_view()),
    path('profile/user', GetUserProfileView.as_view()),
    path('profile/user/update', UpdateUserProfileView.as_view()),
    path('login-old', dunneweb_login),
    path('logout-old', dunneweb_logout),
    path('test-marvel', test_marvel_api),
    path('get-marvel-omnis', get_marvel_omnibuses)
]