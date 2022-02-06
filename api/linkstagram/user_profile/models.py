from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #username = models.CharField(unique=True, max_length=100)
    # first_name = models.CharField(max_length=75)
    # last_name = models.CharField(max_length=100)
    bio = models.TextField(max_length=350, default='')
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    profile_photo = models.ImageField(upload_to='avatars/', null=True, blank=True, default=None)
    is_dead_profile = models.BooleanField(default=False)
    is_group_of_interest = models.BooleanField(default=False)
    tags = ArrayField(models.CharField(max_length=100), null=True, blank=True, default=None)

    def increment_followers(self):
        self.followers_count += 1
        self.save()

    def decrement_followers(self):
        self.followers_count -= 1
        self.save()

    def increment_following(self):
        self.following_count += 1
        self.save()

    def decrement_following(self):
        self.following_count -= 1
        self.save()

    def __str__(self):
        return self.user.username


class UserFollowing(models.Model):
    user = models.ForeignKey(UserProfile, related_name="following", on_delete=models.CASCADE)
    following_user = models.ForeignKey(UserProfile, related_name="followers", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
