from django.contrib.auth import get_user_model
from rest_framework import serializers

from collections import OrderedDict

from user_profile.models import UserProfile

UserModel = get_user_model()


def add_username_to_representation(representation_object, instance):
    user = instance.user
    del representation_object['user']
    representation_object['username'] = user.username
    return representation_object


class DefaultUserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        return add_username_to_representation(obj, instance)


class UserSerializer(DefaultUserSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id',)


class UserCreateUpdateSerializer(DefaultUserSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id', 'followers', 'following', 'username', )

    def is_valid(self, raise_exception=False):
        # sender = self.context['request'].user
        user_to_interact = self.instance
        data = dict(self.initial_data)
        if not user_to_interact:
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


class UserBriefSerializer(DefaultUserSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'profile_photo', 'user', ]
        read_only_fields = ('id',)
