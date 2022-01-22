from rest_framework import serializers

from post.models import Post, PostLike, PostImage
from user_profile.serializers import UserSerializer


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=True, read_only=True)
    images = PostImageSerializer(many=True)

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('id',)


class PostLikeSerializer(serializers.ModelSerializer):
    post = PostSerializer()
    user = UserSerializer()

    class Meta:
        model = PostLike
        fields = '__all__'
        read_only_fields = ('id',)
