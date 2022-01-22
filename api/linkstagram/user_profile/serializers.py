from rest_framework import serializers

from user_profile.models import UserProfile


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id',)
