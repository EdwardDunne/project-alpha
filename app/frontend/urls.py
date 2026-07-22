from django.urls import re_path
from .views import index

# Any path reaching this point (i.e. not matched by admin/, api-auth/, api/,
# or media/) belongs to the SPA. React Router owns client-side routing and
# 404 handling from here.
urlpatterns = [
    re_path(r'^.*$', index),
]