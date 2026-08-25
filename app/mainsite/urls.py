from django.urls import path

from project_alpha import settings
from django.conf.urls.static import static

from .views import UserProfileView, SignupView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, GetUsersView, PasswordResetRequestView, PasswordResetConfirmView
from .comics_views import ArtistView, AuthorView, BookOwnedView, BookView, BookWishlistView, CharacterView, FormatView, PublisherView, SubCategoryView, TeamView

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
    path('profile/user', UserProfileView.as_view()),
    path('profile/user/update', UserProfileView.as_view()),
    path('comics/books', BookView.as_view()),
    path('comics/books/wishlist', BookWishlistView.as_view()),
    path('comics/books/owned', BookOwnedView.as_view()),
    path('comics/characters', CharacterView.as_view()),
    path('comics/publishers', PublisherView.as_view()),
    path('comics/authors', AuthorView.as_view()),
    path('comics/artists', ArtistView.as_view()),
    path('comics/formats', FormatView.as_view()),
    path('comics/sub-categories', SubCategoryView.as_view()),
    path('comics/teams', TeamView.as_view()),
]

# File Uploads
urlpatterns += static(settings.MEDIA_URL, 
    document_root=settings.MEDIA_ROOT)