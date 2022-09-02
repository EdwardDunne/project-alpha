from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index),
    path('admin-test', index),
    path('join', index),
    path('create', index),
    path('join/1', index),
    path('api/', include('mainsite.urls'))
]