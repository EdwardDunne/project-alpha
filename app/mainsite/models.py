from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=256, default='')
    last_name = models.CharField(max_length=256, default='')
    email = models.CharField(max_length=128, default='')

    ADMIN = 'ADMIN'
    USER = 'USER'
    ROLES = [
        (ADMIN, 'Administrator'),
        (USER, 'User'),
    ]
    role = models.CharField(
        max_length=16,
        choices=ROLES,
        default=USER,
    )

    def __str__(self):
        return self.email

class Book(models.Model):
    
    OMNIBUS = 'OM'
    HARDCOVER = 'HC'
    TRADE_PAPERBACK = 'TPB'
    FORMATS = [
        (OMNIBUS, 'Omnibus'),
        (HARDCOVER, 'Hardcover'),
        (TRADE_PAPERBACK, 'Trade Paperback'),
    ]
    format = models.CharField(
        max_length=3,
        choices=FORMATS,
        default=OMNIBUS,
    )

    publisher = models.ForeignKey("Publisher", on_delete=models.DO_NOTHING, null=True)
    marvel_id = models.IntegerField(null=True)
    title = models.CharField(max_length=128, unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(null=True)
    thumbnail_url = models.URLField(max_length=256, null=True, blank=True)
    author = models.CharField(max_length=64, null=True, blank=True)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    page_count = models.IntegerField(null=True)
    character = models.ForeignKey("Character", on_delete=models.DO_NOTHING, null=True)
    team = models.CharField(max_length=256, null=True, blank=True)
    thumbnail = models.FileField(upload_to ='uploads/book-thumbnails/', null=True)

    @property
    def publisher_name(self):
        return self.publisher.name
    
    @property
    def character_name(self):
        return self.character.name
    
    def __str__(self):
        return self.title


class Character(models.Model):
    name = models.CharField(max_length=100, unique=True)
    publisher = models.ForeignKey("Publisher", on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name