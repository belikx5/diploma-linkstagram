from rest_framework import viewsets, views

from post.models import Post, PostLike
from post.serializers import PostSerializer, PostLikeSerializer, PostLikeCreateSerializer


class PostListViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # create_serializer_class = PostSerializer
    list_serializer_class = PostSerializer


class PostLikeViewSet(viewsets.ModelViewSet):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer
    create_serializer_class = PostLikeCreateSerializer

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            if hasattr(self, 'create_serializer_class'):
                return self.create_serializer_class
        elif self.action == 'list':
            return self.serializer_class
        return super().get_serializer_class()

    def perform_create(self, serializer):
        post_data = serializer.validated_data.get('post', None)
        # user_data = serializer.validated_data.get('user', None)
        # like_exist = self.queryset.filter(post_id=post_data.id, user_id=user_data.id).first()
        required_post = Post.objects.get(id=post_data.id)
        # if like_exist:
        required_post.increment_likes()

        instance = serializer.save()
        instance.save()

    def perform_destroy(self, instance):
        post_id = instance.post.id
        required_post = Post.objects.get(id=post_id)
        # if not required_post:
        #     raise Exception('Provided invalid post')
        required_post.decrement_likes()
        instance.delete()
