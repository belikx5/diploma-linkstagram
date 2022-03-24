from rest_framework import serializers

from dead_profile.models import DeadProfile
from post.models import Post
from post.serializers import PostSerializer
from user_profile.models import UserProfile
from user_profile.serializers import UserBriefSerializer


class DeadProfileSerializer(serializers.ModelSerializer):
    """Dead profile serializer"""
    user = UserBriefSerializer()
    trusted_users = UserBriefSerializer(many=True)

    class Meta:
        model = DeadProfile
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        dead_user_id = obj['user']['id']
        posts = PostSerializer(Post.objects.filter(author__id=dead_user_id).exclude(memory_created_by_user=None), many=True).data
        obj['posts'] = posts
        return obj


class DeadProfileCreateSerializer(serializers.ModelSerializer):
    """Dead profile create serializer"""
    class Meta:
        model = DeadProfile
        fields = '__all__'
        read_only_fields = ('id',)


class DeadProfileUpdateSerializer(serializers.ModelSerializer):
    """Dead profile update trusted users serializer"""
    class Meta:
        model = DeadProfile
        fields = '__all__'
        read_only_fields = ('id', 'user')
