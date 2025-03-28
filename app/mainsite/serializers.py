from rest_framework import serializers
from django.contrib.auth.models import User
from mainsite.models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_staff',)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

#  ALTERNATE APPROACH
# class UserProfileSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     first_name = serializers.CharField(max_length=50)
#     last_name = serializers.CharField(max_length=50)