from django.contrib.auth import get_user_model
from rest_framework import serializers

from collections import OrderedDict

from user_profile.models import UserProfile, UserFollowing

UserModel = get_user_model()


def add_username_to_representation(representation_object, instance):
    user = instance.user
    del representation_object['user']
    representation_object['username'] = user.username
    return representation_object


# default user serializer just to get username from user field in to_representation
class DefaultUserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        obj = super().to_representation(instance)
        return add_username_to_representation(obj, instance)


# User info - short version
class UserBriefSerializer(DefaultUserSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'profile_photo', 'user', ]
        read_only_fields = ('id',)


# default user followers-following serializer
class DefaultUserFollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = '__all__'


# serializer for curr user followers + remove 'following_user' field as it references to curr user
class UserFollowingMeSerializer(DefaultUserFollowingSerializer):
    user = UserBriefSerializer()

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        del obj['following_user']
        return obj


# serializer for followed by curr user users + rewrite 'user' field as it references to curr user
class UserFollowedByMeSerializer(DefaultUserFollowingSerializer):
    following_user = UserBriefSerializer()

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        obj['user'] = obj['following_user']
        del obj['following_user']
        return obj


class UserFollowingListSerializer(DefaultUserFollowingSerializer):
    following_user = UserBriefSerializer()
    user = UserBriefSerializer()


# 'create' action serializer for user following-followers
class UserFollowingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = '__all__'

    def is_valid(self, raise_exception=False):
        instance = self.instance
        data = dict(self.initial_data)
        if not instance:
            already_following = UserFollowing.objects.filter(
                user_id=data.get('user')[0],
                following_user__id=data.get('following_user')[0]
            ).first()
            if already_following:
                raise serializers.ValidationError("You are already following this user")
        return super().is_valid(raise_exception)


# User profile serializer
class UserSerializer(DefaultUserSerializer):
    followers = UserFollowingMeSerializer(many=True)
    following = UserFollowedByMeSerializer(many=True)

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
