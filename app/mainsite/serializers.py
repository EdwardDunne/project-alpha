from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from mainsite.models import Artist, Author, Book, Character, Format, Publisher, SubCategory, Team, UserProfile

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
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = UserProfile
        fields = '__all__'

# Declared ahead of BookSerializer since BookSerializer nests all of these
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

class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    character_names = serializers.ReadOnlyField()

    class Meta:
        model = Team
        fields = '__all__'
        extra_kwargs = {
            'characters': {'required': False},
        }

class BookSerializer(serializers.ModelSerializer):
    publisher_data = PublisherSerializer(source='publisher', read_only=True)
    format_data = FormatSerializer(source='format', read_only=True)
    sub_category_data = SubCategorySerializer(source='sub_category', read_only=True)
    team_data = TeamSerializer(source='team', read_only=True)
    characters_data = CharacterSerializer(source='characters', many=True, read_only=True)
    authors_data = AuthorSerializer(source='authors', many=True, read_only=True)
    artists_data = ArtistSerializer(source='artists', many=True, read_only=True)
    # Populated via context (BookView.get) with id sets computed once
    # per request rather than once per book
    is_wishlisted = serializers.SerializerMethodField()
    is_owned = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'
        extra_kwargs = {
            'marvel_id': {'required': False},
            'price': {'required': False, 'min_value': 0, 'coerce_to_string': False},
            'isbn': {'required': False},
            'page_count': {'min_value': 1, 'max_value': 5000},
            'volume_number': {'required': False, 'min_value': 1},
            'thumbnail': {'required': True, 'validators': [validate_thumbnail]},
            'authors': {'required': False},
            'artists': {'required': False},
            'characters': {'required': False},
            'sub_category': {'required': False},
            'team': {'required': False},
        }

    def get_is_wishlisted(self, obj):
        return obj.id in self.context.get('wishlisted_ids', set())

    def get_is_owned(self, obj):
        return obj.id in self.context.get('owned_ids', set())
