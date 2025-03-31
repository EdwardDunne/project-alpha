from django.contrib import admin

from mainsite.models import Book, Character, Publisher

# Register your models here.
admin.site.register(Book)
admin.site.register(Character)
admin.site.register(Publisher)