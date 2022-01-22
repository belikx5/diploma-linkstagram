from rest_framework import viewsets, views
from rest_framework.response import Response

from post.models import Post
from post.serializers import PostSerializer


class PostListViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    # create_serializer_class = PostSerializer
    # list_serializer_class = PostSerializer

def posts_view():
    posts = Post.objects.all()
    # images = PostImage.objects.filter(post=post)
    return Response(status=200, data={'post': posts})
