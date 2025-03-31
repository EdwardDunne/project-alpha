from django.urls import path

from project_alpha import settings
from django.conf.urls.static import static

from .views import BookView, CharacterView, PublisherView, UpdateUserProfileView, SignupView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, GetUsersView, GetUserProfileView, TestMarvelApi, MarvelOmnis, DCOmnisScarpe, AmazonDetailsScrape, DCOmnisScarpe2, MarvelOmnisScarpe

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
    path('scrape-dc-omnis2', DCOmnisScarpe2.as_view()),
    path('scrape-marvel-omnis', MarvelOmnisScarpe.as_view()),
    path('scrape-amazon-details', AmazonDetailsScrape.as_view()),
    path('comics/add-book', BookView.as_view()),
    path('comics/get-omnis', BookView.as_view()),
    path('comics/add-character', CharacterView.as_view()),
    path('comics/get-characters', CharacterView.as_view()),
    path('comics/add-publisher', PublisherView.as_view()),
    path('comics/get-publishers', PublisherView.as_view()),
]

# File Uploads
urlpatterns += static(settings.MEDIA_URL, 
    document_root=settings.MEDIA_ROOT)