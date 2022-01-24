from django.contrib.auth import get_user_model
from rest_framework import serializers

from collections import OrderedDict

from user_profile.models import UserProfile

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id',)

    def is_valid(self, raise_exception=False):
        data = dict(self.initial_data)
        username = data.get('username')[0]
        user_exists = UserModel.objects.filter(username=username).first()
        if user_exists:
            raise serializers.ValidationError("User with a provided username already exists")

        user = UserModel.objects.create_user(
            username=username,
            password=data.get('password')[0]
        )

        data['user'] = user.id
        self.initial_data = OrderedDict(data)
        return super().is_valid(raise_exception)
