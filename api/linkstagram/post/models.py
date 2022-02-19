from django.db import models

from user_profile.models import UserProfile


class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False, related_name='posts')
    memory_created_by_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE,
                                               blank=True, null=True, related_name='memories')
    description = models.TextField()
    likes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def increment_likes(self):
        self.likes_count += 1
        self.save()

    def decrement_likes(self):
        self.likes_count -= 1
        self.save()

    def __str__(self):
        return f'{self.author.user.username} - post_id: {self.id}'


class PostImage(models.Model):
    image = models.ImageField(upload_to='images/')
    post = models.ForeignKey(Post, default=None,
                             on_delete=models.CASCADE, related_name='images')


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=False, related_name='likes')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False, related_name='user_like')
    created_at = models.DateTimeField(auto_now_add=True)


class PostComment(models.Model):
    message = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=False, related_name='comments')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
