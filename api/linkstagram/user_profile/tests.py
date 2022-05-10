from django.contrib.auth import get_user_model
from django.test import TestCase
from user_profile.models import UserProfile

UserModel = get_user_model()


class UserProfileTestCase(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create(username='test', email='test@mail.com', password='nopass')
        self.user_to_follow = UserModel.objects.create(username='toFollow', email='test@mail.com', password='nopass')
        self.profile = UserProfile.objects.create(user=self.user, bio='')
        self.profile_to_follow = UserProfile.objects.create(user=self.user_to_follow, bio='')

    def test_profile_default_values(self):
        """Followers and followings should be 0 by default"""
        self.assertEqual(self.profile.followers_count, 0)
        self.assertEqual(self.profile.following_count, 0)

    def test_followers_count_change(self):
        """Followers and followings should be incremented by 1"""
        self.profile_to_follow.increment_followers()
        self.profile.increment_following()

        self.assertEqual(self.profile.following_count, 1)
        self.assertEqual(self.profile_to_follow.followers_count, 1)

    def test_mark_as_dead(self):
        """Test mark as dead toggle"""
        self.profile_to_follow.mark_as_dead_profile(True)
        self.assertEqual(self.profile_to_follow.is_dead_profile, True)

        self.profile_to_follow.mark_as_dead_profile(False)
        self.assertEqual(self.profile_to_follow.is_dead_profile, False)

