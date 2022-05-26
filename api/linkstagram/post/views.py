from itertools import chain
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter, SearchFilter

from post.models import Post, PostLike, PostImage, PostComment, PostVideo
from post.serializers import PostSerializer, PostLikeSerializer, PostLikeCreateSerializer, PostCreateSerializer, \
    PostCommentSerializer, PostCommentCreateSerializer


class PostListViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    create_serializer_class = PostCreateSerializer
    list_serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    search_fields = ['$author__id', '$author__user__username', 'tags', 'description']
    filterset_fields = ['author__id']
    ordering_fields = ['created_at']

    def get_queryset(self):
        if self.action == 'list':
            is_search = self.request.query_params.get('search', None)
            # user can't search for memories
            if is_search:
                return Post.objects.filter(memory_created_by_user=None)
            dict_len = len(self.request.query_params)
            # if showing general post list, there are 2 options:
            # show user's feed or show random posts
            if dict_len == 0:
                user = self.request.auth.user if self.request.auth else None
                if user and hasattr(user, 'userprofile'):
                    curr_user = self.request.auth.user.userprofile
                    posts = Post.objects.filter(Q(author__followers__user_id=curr_user.id) | Q(author__id=curr_user.id)).distinct()
                    return posts if len(posts) > 0 else Post.objects.all()
            return Post.objects.all()
        else:
            return super().get_queryset()

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

    def _perform_create_update(self, serializer):
        instance = serializer.save()
        instance.save()
        images = serializer.context['request'].FILES.getlist('images')
        videos = serializer.context['request'].FILES.getlist('videos')
        for image in list(images):
            image_instance = PostImage(post_id=instance.id, image=image)
            image_instance.save()
        for video in list(videos):
            video_instance = PostVideo(post_id=instance.id, video=video)
            video_instance.save()

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


class PostLikeDeleteAPIView(APIView):

    def delete(self, request, post_id, user_id):
        like = PostLike.objects.filter(post_id=post_id, user_id=user_id).first()
        if not like:
            return Response(status=400, data='Like not found')

        like.delete()
        required_post = Post.objects.get(id=post_id)
        required_post.decrement_likes()
        return Response(status=204)


class PostCommentViewSet(viewsets.ModelViewSet):
    queryset = PostComment.objects.all()
    serializer_class = PostCommentSerializer
    create_serializer_class = PostCommentCreateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            if hasattr(self, 'create_serializer_class'):
                return self.create_serializer_class
        elif self.action == 'list':
            return self.serializer_class
        return super().get_serializer_class()
