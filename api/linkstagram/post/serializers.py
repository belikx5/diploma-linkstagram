from rest_framework import serializers

from post.models import Post, PostLike, PostImage, PostComment
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
        obj['is_liked'] = True if self.context.get('request') and likes.filter(
            user_id=self.context.get('request').user.id
        ).first() else False
        return obj


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('id',)


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