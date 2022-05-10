from django.contrib.auth import get_user_model
from django.test import TestCase

from chat.models import Chat, Message
from user_profile.models import UserProfile

UserModel = get_user_model()


class ChatTestCase(TestCase):
    def setUp(self):
        self.user1 = UserModel.objects.create(username='test1', email='test1@mail.com', password='nopass')
        self.profile1 = UserProfile.objects.create(user=self.user1, bio='')
        self.user2 = UserModel.objects.create(username='test2', email='test2@mail.com', password='nopass')
        self.profile2 = UserProfile.objects.create(user=self.user2, bio='')
        self.chat = Chat.objects.create()
        self.chat.participants.set([self.profile1.id, self.profile2.id])

    def test_chat_creation(self):
        """Chat requires participants"""
        self.assertEqual(len(self.chat.participants.all()), 2)
        self.assertIn(self.profile1, self.chat.participants.all())

    def test_message_in_chat(self):
        """After the message is created it should be part of chat"""
        message_content = 'New message'
        message1 = Message.objects.create(chat=self.chat, sender=self.profile1, content=message_content)
        message2 = Message.objects.create(chat=self.chat, sender=self.profile2, content=message_content)
        self.assertEqual(message1.content, message_content)

        self.assertIn(message1, self.chat.messages.all(), "Message1 found in chat")
        self.assertIn(message2, self.chat.messages.all(), "Message2 found in chat")

    def test_messages_sent_by_user(self):
        message1 = Message.objects.create(chat=self.chat, sender=self.profile1, content='test message')
        self.assertIn(message1, self.profile1.sender.all())

    def test_chats_related_to_user(self):
        self.assertIn(self.chat, self.profile1.chats.all())
