from django.contrib.auth import get_user_model
from django.test import TestCase

from chat.models import Chat, Message
from dead_profile.models import DeadProfile
from user_profile.models import UserProfile

UserModel = get_user_model()


class DeadProfileTestCase(TestCase):
    def setUp(self):
        self.user1 = UserModel.objects.create(username='test1', email='test1@mail.com', password='nopass')
        self.profile1 = UserProfile.objects.create(user=self.user1, bio='')
        self.user2 = UserModel.objects.create(username='trusted_user', email='test2@mail.com', password='nopass')
        self.trusted_profile = UserProfile.objects.create(user=self.user2, bio='')
        self.dead_profile = DeadProfile.objects.create(user=self.profile1)
        self.dead_profile.trusted_users.set([self.trusted_profile])

    def test_dead_profile_creation(self):
        """Dead profile related to UserProfile and can have trusted users"""
        self.assertEqual(len(self.dead_profile.trusted_users.all()), 1)
        self.assertIn(self.trusted_profile, self.dead_profile.trusted_users.all())

    def test_user_has_access_to_dead_profile(self):
        """User from trusted users list must be able to access dead profile"""
        self.assertIn(self.dead_profile, self.trusted_profile.trusted_user_access.all())
