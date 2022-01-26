from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #username = models.CharField(unique=True, max_length=100)
    # first_name = models.CharField(max_length=75)
    # last_name = models.CharField(max_length=100)
    bio = models.TextField(max_length=350, default='')
    followers = models.PositiveIntegerField(default=0)
    following = models.PositiveIntegerField(default=0)
    profile_photo = models.ImageField(upload_to='avatars/', null=True, blank=True, default=None)
    is_group_of_interest = models.BooleanField(default=False)
    tags = ArrayField(models.CharField(max_length=100), null=True, blank=True, default=None)

    def __str__(self):
        return self.user.username
