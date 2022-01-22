# from django.contrib.postgres.fields import ArrayField
from django_better_admin_arrayfield.models.fields import ArrayField
from django.db import models

from user_profile.models import UserProfile


class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE,
                               blank=True, null=True, related_name='posts')
    description = models.TextField()
    likes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PostImage(models.Model):
    image = models.ImageField(upload_to='images/')
    post = models.ForeignKey(Post, default=None,
                             on_delete=models.CASCADE, related_name='images')


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,
                             blank=True, null=True, related_name='post_like')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE,
                             blank=True, null=True, related_name='user_like')
    created_at = models.DateTimeField(auto_now_add=True)
