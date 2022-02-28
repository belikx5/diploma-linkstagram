from django.contrib.auth import get_user_model
from rest_framework import serializers

from collections import OrderedDict

# from post.serializers import PostSerializer
from user_profile.models import UserProfile, UserFollowing

UserModel = get_user_model()


def add_user_following_to_representation(representation_object, instance, curr_user):
    if not hasattr(curr_user, 'userprofile'):
        representation_object['is_follower'] = False
        representation_object['is_following'] = False
    followers = instance.followers
    found_in_followers = followers.filter(
        user__id=curr_user.userprofile.id) if instance.id != curr_user.userprofile.id else False
    representation_object['is_following'] = True if found_in_followers and found_in_followers.first() else False
    following = instance.following
    found_in_following = following.filter(
        following_user__id=curr_user.userprofile.id) if instance.id != curr_user.userprofile.id else False
    representation_object['is_follower'] = True if found_in_following and found_in_following.first() else False
    return representation_object


def add_username_to_representation(representation_object, instance):
    user = instance.user
    del representation_object['user']
    representation_object['username'] = user.username
    representation_object['first_name'] = user.first_name
    representation_object['last_name'] = user.last_name
    return representation_object


class UserBriefMeta:
    class Meta:
        model = UserProfile
        fields = ['id', 'profile_photo', 'user', ]
        read_only_fields = ('id',)


class DefaultUserSerializer(serializers.ModelSerializer):
    """default user serializer just to get username from user field in to_representation"""

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        return add_username_to_representation(obj, instance)


class UserBriefSerializer(DefaultUserSerializer):
    """User info - short version"""

    class Meta:
        model = UserProfile
        fields = ['id', 'profile_photo', 'user', ]
        read_only_fields = ('id',)


class DefaultUserFollowingSerializer(serializers.ModelSerializer):
    """default user followers-following serializer"""

    class Meta:
        model = UserFollowing
        fields = '__all__'


class UserFollowingMeSerializer(DefaultUserFollowingSerializer):
    """serializer for curr user followers + remove 'following_user' field as it references to curr user"""
    user = UserBriefSerializer()

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        del obj['following_user']
        return obj


class UserFollowedByMeSerializer(DefaultUserFollowingSerializer):
    """serializer for followed by curr user users + rewrite 'user' field as it references to curr user"""
    following_user = UserBriefSerializer()

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        obj['user'] = obj['following_user']
        del obj['following_user']
        return obj


class UserFollowingListSerializer(DefaultUserFollowingSerializer):
    following_user = UserBriefSerializer()
    user = UserBriefSerializer()


class UserFollowingCreateSerializer(serializers.ModelSerializer):
    """'create' action serializer for user following-followers"""

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


class TrustedUserSerializer(serializers.ModelSerializer, UserBriefMeta):
    """User info - short version"""
    user = UserBriefSerializer()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', ]
        read_only_fields = ('id',)


class UserSerializer(DefaultUserSerializer):
    """User profile serializer"""
    followers = UserFollowingMeSerializer(many=True)
    following = UserFollowedByMeSerializer(many=True)
    trusted_user_access = TrustedUserSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        print(self)
        curr_user = self.context.get('request').user
        obj = super().to_representation(instance)
        return add_user_following_to_representation(obj, instance, curr_user)


class UserCreateUpdateSerializer(DefaultUserSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('id', 'followers', 'following', 'username',)

    def is_valid(self, raise_exception=False):
        user_to_interact = self.instance
        data = dict(self.initial_data)
        if not user_to_interact:
            username = data.get('username')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            if not first_name or not last_name:
                raise serializers.ValidationError("Please specify user name and surname")

            user_exists = UserModel.objects.filter(username=username).first()
            if user_exists:
                raise serializers.ValidationError("User with a provided username already exists")

            user = UserModel.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                password=data.get('password')
            )

            data['user'] = user.id
            self.initial_data = OrderedDict(data)
        return super().is_valid(raise_exception)


# class UserWithPostsSerializer(DefaultUserSerializer):
#     posts = PostSerializer(many=True)
#     user = UserBriefSerializer()
#
#     class Meta:
#         model = UserProfile
#         fields = ['id', 'user', 'profile_photo', 'posts']
#         read_only_fields = ('id',)
