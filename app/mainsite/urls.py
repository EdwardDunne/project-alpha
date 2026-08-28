from django.urls import path
from rest_framework.routers import SimpleRouter

from project_alpha import settings
from django.conf.urls.static import static

from .views import UserProfileView, SignupView, GetCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, DeleteAccountView, GetUsersView, PasswordResetRequestView, PasswordResetConfirmView
from .comics_views import ArtistViewSet, AuthorViewSet, BookViewSet, CharacterViewSet, FormatViewSet, PublisherViewSet, SubCategoryViewSet, TeamViewSet

router = SimpleRouter()
router.register('comics/books', BookViewSet, basename='book')
router.register('comics/characters', CharacterViewSet, basename='character')
router.register('comics/publishers', PublisherViewSet, basename='publisher')
router.register('comics/authors', AuthorViewSet, basename='author')
router.register('comics/artists', ArtistViewSet, basename='artist')
router.register('comics/formats', FormatViewSet, basename='format')
router.register('comics/sub-categories', SubCategoryViewSet, basename='subcategory')
router.register('comics/teams', TeamViewSet, basename='team')

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
] + router.urls

# File Uploads
urlpatterns += static(settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT)
