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


def add_is_liked_to_representation(self, representation_obj, likes):
    representation_obj['is_liked'] = True if self.context.get('request') and likes.filter(
        user_id=self.context.get('request').user.id
    ).first() else False
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
        obj = super().to_representation(instance)
        return add_is_liked_to_representation(self, obj, likes)


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        # likes = instance.likes
        # obj = super().to_representation(instance)
        # obj['is_liked'] = True if self.context.get('request') and likes.filter(
        #     user_id=self.context.get('request').user.id
        # ).first() else False
        # return obj
        context = {"request": self.context['request']}
        likes = instance.likes
        images = instance.images
        author = instance.author
        obj = super().to_representation(instance)
        new_obj = add_is_liked_to_representation(self, obj, likes)
        new_obj['comments'] = []
        new_obj['author'] = UserBriefSerializer(author, context=context).data
        new_obj['images'] = PostImageSerializer(instance=images, many=True, context=context).data
        return new_obj

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