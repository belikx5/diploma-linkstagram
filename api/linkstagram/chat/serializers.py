from rest_framework import serializers

from chat.models import Message, Chat
from user_profile.serializers import UserBriefSerializer
from django.db.models import Q


class MessageCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('id',)


class MessageSerializer(serializers.ModelSerializer):
    sender = UserBriefSerializer()

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('id',)


class ChatCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['participants']


class ChatBriefSerializer(serializers.ModelSerializer):
    """list chat serializer"""
    participants = UserBriefSerializer(many=True)

    class Meta:
        model = Chat
        fields = '__all__'
        read_only_fields = ('id',)

    def to_representation(self, instance):
        obj = super().to_representation(instance)
        curr_user = self.context['request'].user
        if hasattr(curr_user, 'userprofile'):
            user_id = curr_user.userprofile.id
            obj['companion'] = [user for user in obj['participants'] if user['id'] != user_id][0]
        else:
            obj['companion'] = obj['participants'][0]
        chat_messages = Message.objects.filter(chat_id=obj['id'])
        obj['last_message'] = chat_messages.last().content if len(chat_messages) > 0 else None
        return obj


class ChatSerializer(ChatBriefSerializer):
    """chat details serializer"""
    messages = MessageSerializer(many=True)
