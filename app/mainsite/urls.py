from django.urls import path

from project_alpha import settings
from django.conf.urls.static import static

from .views import BookView, CharacterView, GetBooksView, GetCharactersView, GetPublishersView, PublisherView, UpdateUserProfileView, SignupView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, GetUsersView, GetUserProfileView, PasswordResetRequestView, PasswordResetConfirmView
from .data_collecting import ScrapePB

urlpatterns = [
    path('csrf-cookie', GetCSRFToken.as_view()),
    path('authenticated', CheckAuthenticatedView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('register', SignupView.as_view()),
    path('password-reset/request', PasswordResetRequestView.as_view()),
    path('password-reset/confirm', PasswordResetConfirmView.as_view()),
    path('delete-account', DeleteAccountView.as_view()),
    path('get-users', GetUsersView.as_view()),
    path('profile/user', GetUserProfileView.as_view()),
    path('profile/user/update', UpdateUserProfileView.as_view()),
    path('scrape-pb-dc', ScrapePB.as_view()),
    path('comics/add-book', BookView.as_view()),
    path('comics/get-omnis', GetBooksView.as_view()),
    path('comics/add-character', CharacterView.as_view()),
    path('comics/get-characters', GetCharactersView.as_view()),
    path('comics/add-publisher', PublisherView.as_view()),
    path('comics/get-publishers', GetPublishersView.as_view()),
]

# File Uploads
urlpatterns += static(settings.MEDIA_URL, 
    document_root=settings.MEDIA_ROOT)