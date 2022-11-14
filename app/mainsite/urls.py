from django.urls import path
from .views import UpdateUserProfileView, SignupView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, GetUsersView, GetUserProfileView, TestMarvelApi, MarvelOmnis, DCOmnisScarpe, AmazonDetailsScrape

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
    path('test-marvel', TestMarvelApi.as_view()),
    path('get-marvel-omnis', MarvelOmnis.as_view()),
    path('scrape-dc-omnis', DCOmnisScarpe.as_view()),
    path('scrape-amazon-details', AmazonDetailsScrape.as_view())
]