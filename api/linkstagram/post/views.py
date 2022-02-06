from rest_framework import viewsets, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from post.models import Post, PostLike, PostImage
from post.serializers import PostSerializer, PostLikeSerializer, PostLikeCreateSerializer, PostCreateSerializer


class PostListViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    create_serializer_class = PostCreateSerializer
    list_serializer_class = PostSerializer

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            if hasattr(self, 'create_serializer_class'):
                return self.create_serializer_class
        elif self.action == 'list':
            return self.serializer_class
        return super().get_serializer_class()

    def get_permissions(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    @staticmethod
    def _perform_create_update(serializer):
        instance = serializer.save()
        instance.save()
        images = serializer.context['request'].FILES.getlist('images')
        for image in list(images):
            m2 = PostImage(post_id=instance.id, image=image)
            m2.save()

    def perform_create(self, serializer):
        self._perform_create_update(serializer)

    def perform_update(self, serializer):
        self._perform_create_update(serializer)


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

    def get_permissions(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        post_data = serializer.validated_data.get('post', None)
        required_post = Post.objects.get(id=post_data.id)
        required_post.increment_likes()

        instance = serializer.save()
        instance.save()

    def perform_destroy(self, instance):
        post_id = instance.post.id
        required_post = Post.objects.get(id=post_id)
        required_post.decrement_likes()

        instance.delete()
