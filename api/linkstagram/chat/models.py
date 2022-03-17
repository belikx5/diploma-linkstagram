from django.db import models

from user_profile.models import UserProfile


class Chat(models.Model):
    participants = models.ManyToManyField(UserProfile, related_name='chats')

    # def last_10_messages(self):
    #     return self.messages.objects.order_by('-created_at').all()[:10]
    def __str__(self):
        return f'{self.pk}'


class Message(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sender')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(max_length=1200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.user.username} - {self.content[:100]}...'
