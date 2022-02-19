import os
from collections import OrderedDict

from rest_framework import serializers

from post.models import Post, PostLike, PostImage, PostComment
from user_profile.models import UserProfile
from user_profile.serializers import UserSerializer, UserBriefSerializer


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__'


class PostCommentSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer()

    class Meta:
        model = PostComment
        fields = '__all__'


class PostCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostComment
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


def add_is_liked_to_representation(curr_user_id, representation_obj, likes):
    representation_obj['is_liked'] = True if likes.filter(user_id=curr_user_id).first() else False
    return representation_obj


class PostSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer()
    images = PostImageSerializer(many=True)
    comments = PostCommentSerializer(many=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        likes = instance.likes
        curr_user = self.context['request'].user
        obj = super().to_representation(instance)
        if hasattr(curr_user, 'userprofile'):
            return add_is_liked_to_representation(curr_user.userprofile.id, obj, likes)
        obj['is_liked'] = False
        return obj


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        context = {"request": self.context['request']}
        images = instance.images
        author = instance.author
        obj = super().to_representation(instance)
        obj['is_liked'] = False
        obj['comments'] = []
        obj['author'] = UserBriefSerializer(author, context=context).data
        obj['images'] = PostImageSerializer(instance=images, many=True, context=context).data
        return obj

    def is_valid(self, raise_exception=False):
        user_id = self.context['request'].auth.user.id
        profile = UserProfile.objects.get(user__id=user_id)
        data = dict(self.get_initial())
        data['author'] = profile.id
        self.initial_data = OrderedDict(data)
        return super().is_valid(raise_exception)


class PostLikeSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = PostLike
        fields = '__all__'
        read_only_fields = ('id',)


class PostLikeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ['id', 'post', 'user']
        read_only_fields = ('id',)

    def is_valid(self, raise_exception=False):
        data = dict(self.initial_data)
        user_id = data.get('user')
        post_id = data.get('post')
        like_exists = PostLike.objects.filter(user_id=user_id, post_id=post_id).first()
        if like_exists:
            raise serializers.ValidationError("You can't like the same post twice")
        return super().is_valid(raise_exception)
