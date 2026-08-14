from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=256, default='')
    last_name = models.CharField(max_length=256, default='')

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

    @property
    def email(self):
        # Derived from the linked User rather than stored separately
        return self.user.email

    def __str__(self):
        return self.email


class BookQuerySet(models.QuerySet):
    def with_related(self):
        """
        Eager-load Book data
        """
        return self.select_related(
            'publisher', 'format', 'sub_category', 'team'
        ).prefetch_related('characters', 'authors', 'artists')


class Book(models.Model):
    objects = BookQuerySet.as_manager()

    format = models.ForeignKey("Format", on_delete=models.PROTECT, null=True)
    sub_category = models.ForeignKey("SubCategory", on_delete=models.PROTECT, null=True, blank=True)

    publisher = models.ForeignKey("Publisher", on_delete=models.PROTECT, null=True)
    marvel_id = models.IntegerField(null=True)
    title = models.CharField(max_length=128, unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    thumbnail_url = models.URLField(max_length=256, null=True, blank=True)
    authors = models.ManyToManyField("Author", blank=True)
    artists = models.ManyToManyField("Artist", blank=True)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    page_count = models.IntegerField(null=True)
    volume_number = models.IntegerField(null=True)
    characters = models.ManyToManyField("Character", blank=True)
    team = models.ForeignKey("Team", on_delete=models.PROTECT, null=True, blank=True)
    thumbnail = models.FileField(upload_to ='uploads/book-thumbnails/', null=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class Character(models.Model):
    name = models.CharField(max_length=100, unique=True)
    publisher = models.ForeignKey("Publisher", on_delete=models.PROTECT, null=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=256, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Author(models.Model):
    name = models.CharField(max_length=256, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Artist(models.Model):
    name = models.CharField(max_length=256, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Format(models.Model):
    name = models.CharField(max_length=256, unique=True)
    abbreviation = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=256, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=256, unique=True)
    characters = models.ManyToManyField("Character", blank=True)

    class Meta:
        ordering = ['name']

    @property
    def character_names(self):
        return [c.name for c in self.characters.all()]

    def __str__(self):
        return self.name
