from django.contrib.auth import get_user_model
from django.test import TestCase

from post.models import Post, PostComment
from user_profile.models import UserProfile

UserModel = get_user_model()


class PostTestCase(TestCase):
    def setUp(self):
        self.user = UserModel.objects.create(username='test', email='test@mail.com', password='nopass')
        self.profile = UserProfile.objects.create(user=self.user, bio='')
        self.post = Post.objects.create(author=self.profile, description='description', tags=['tag1', 'tag2'])

    def test_post_default_values(self):
        """
            Likes count should be 0 by default
            If user created 2 tags, this also should be saved
        """
        self.assertEqual(self.post.likes_count, 0)
        self.assertEqual(len(self.post.tags), 2)

    def test_likes_count_change(self):
        """Likes should be incremented by 1"""
        self.post.increment_likes()
        self.assertEqual(self.post.likes_count, 1)

        self.post.decrement_likes()
        self.assertEqual(self.post.likes_count, 0)

    def test_post_comment(self):
        """Add comment to post"""
        message_content = 'Test message'
        comment = PostComment.objects.create(post=self.post, user=self.profile, message=message_content)
        self.assertEqual(comment.message, message_content)
        self.assertEqual(len(self.post.comments.all()), 1)


