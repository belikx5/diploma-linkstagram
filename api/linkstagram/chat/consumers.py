import json
import datetime

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from chat.models import Message, Chat
from user_profile.models import UserProfile


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chat_group_name = ''
        self.chat_id = ''

    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_name = f'chat_{self.chat_id}'

        # Join chat group.
        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group.
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

    # Receive message from WebSocket.
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        content = text_data_json['content']
        username = text_data_json['username']

        # Save message to database.
        await self.save_message(username, content)
        # Send message to room group
        await self.channel_layer.group_send(
            self.chat_group_name, {
                'type': 'chat_message',
                'content': content,
                'username': username
            }
        )

    # Receive message from chat group.
    async def chat_message(self, event):
        content = event['content']
        username = event['username']

        # Send message to WebSocket.
        await self.send(text_data=json.dumps({
            'content': content,
            'username': username,
            'created_at': str(datetime.datetime.now())
        }))

    # Create message object in database.
    @database_sync_to_async
    def save_message(self, username, content):
        Message.objects.create(
            chat=Chat.objects.get(id=self.chat_id),  # Chat object.
            sender=UserProfile.objects.get(user__username=username),  # User object.
            content=content,  # Message text content.
        )
