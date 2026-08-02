from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from mainsite.models import Artist, Author, Book, Character, Publisher, UserProfile

MAX_THUMBNAIL_SIZE_MB = 5
VALID_THUMBNAIL_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

def validate_thumbnail(file):
    if file.size > MAX_THUMBNAIL_SIZE_MB * 1024 * 1024:
        raise ValidationError(f'Thumbnail must be {MAX_THUMBNAIL_SIZE_MB}MB or smaller.')

    if file.content_type not in VALID_THUMBNAIL_CONTENT_TYPES:
        raise ValidationError('Thumbnail must be a JPEG, PNG, WebP, or GIF image.')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'is_staff',)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    publisher_name = serializers.ReadOnlyField()
    character_names = serializers.ReadOnlyField()
    author_names = serializers.ReadOnlyField()
    artist_names = serializers.ReadOnlyField()

    class Meta:
        model = Book
        fields = '__all__'
        extra_kwargs = {
            'marvel_id': {'required': False},
            'price': {'required': False, 'min_value': 0},
            'isbn': {'required': False},
            'page_count': {'min_value': 1, 'max_value': 5000},
            # A thumbnail is required to create a book, but PUT uses partial=True
            # so an edit that isn't replacing the thumbnail can still omit it.
            'thumbnail': {'required': True, 'validators': [validate_thumbnail]},
            'authors': {'required': False},
            'artists': {'required': False},
            'characters': {'allow_empty': False},
        }

class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'
