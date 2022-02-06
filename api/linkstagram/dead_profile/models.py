from django.db import models

from user_profile.models import UserProfile


class DeadProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, unique=True)
    # memories = ArrayField(models.ForeignKey(Post), default=list)
    trusted_users = models.ManyToManyField(UserProfile, blank=True, related_name='trusted_user_access')

    def __str__(self):
        return f'{self.user.user.username} - dead_profile: {self.id}'
# maybe better to add memory_ccreated_by_user = fk(UserProfile)
# in post model
