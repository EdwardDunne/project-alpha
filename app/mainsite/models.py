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

    format = models.ForeignKey("Format", on_delete=models.DO_NOTHING, null=True)
    sub_category = models.ForeignKey("SubCategory", on_delete=models.DO_NOTHING, null=True, blank=True)

    publisher = models.ForeignKey("Publisher", on_delete=models.DO_NOTHING, null=True)
    marvel_id = models.IntegerField(null=True)
    title = models.CharField(max_length=128, unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(null=True)
    thumbnail_url = models.URLField(max_length=256, null=True, blank=True)
    authors = models.ManyToManyField("Author", blank=True)
    artists = models.ManyToManyField("Artist", blank=True)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    page_count = models.IntegerField(null=True)
    volume_number = models.IntegerField(null=True)
    characters = models.ManyToManyField("Character", blank=True)
    team = models.ForeignKey("Team", on_delete=models.DO_NOTHING, null=True, blank=True)
    thumbnail = models.FileField(upload_to ='uploads/book-thumbnails/', null=True)

    @property
    def publisher_name(self):
        return self.publisher.name

    @property
    def format_name(self):
        return self.format.name

    @property
    def format_abbreviation(self):
        return self.format.abbreviation

    @property
    def sub_category_name(self):
        return self.sub_category.name if self.sub_category else None

    @property
    def character_names(self):
        return [c.name for c in self.characters.all()]

    @property
    def author_names(self):
        return [a.name for a in self.authors.all()]

    @property
    def artist_names(self):
        return [a.name for a in self.artists.all()]

    @property
    def team_name(self):
        return self.team.name if self.team else None

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

class Author(models.Model):
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name

class Artist(models.Model):
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name

class Format(models.Model):
    name = models.CharField(max_length=256, unique=True)
    abbreviation = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=256, unique=True)
    characters = models.ManyToManyField("Character", blank=True)

    @property
    def character_names(self):
        return [c.name for c in self.characters.all()]

    def __str__(self):
        return self.name