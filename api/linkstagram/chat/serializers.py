from rest_framework import serializers

from chat.models import Message, Chat
from user_profile.serializers import UserBriefSerializer


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


class ChatSerializer(serializers.ModelSerializer):
    participants = UserBriefSerializer(many=True)

    class Meta:
        model = Chat
        fields = '__all__'
        read_only_fields = ('id',)
