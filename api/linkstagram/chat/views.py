from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from chat.models import Chat, Message
from chat.serializers import ChatSerializer, ChatCreateSerializer, MessageSerializer, MessageCreateUpdateSerializer, \
    ChatBriefSerializer


class ChatViewSet(viewsets.ModelViewSet):
    list_serializer_class = ChatBriefSerializer
    serializer_class = ChatSerializer
    create_serializer_class = ChatCreateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # TODO: change to IsAuthenticated only


    def get_serializer_class(self):
        # 'update', 'destroy', 'partial_update'
        if self.action == 'create' and hasattr(self, 'create_serializer_class'):
            return self.create_serializer_class
        elif self.action == 'list':
            return self.list_serializer_class
        elif self. action == 'retrieve':
            return self.serializer_class
        return super().get_serializer_class()

    def get_queryset(self):
        return Chat.objects.filter(participants__user_id=self.request.user.id)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    create_update_serializer_class = MessageCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # TODO: change to IsAuthenticated only
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['chat__id']

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            if hasattr(self, 'create_update_serializer_class'):
                return self.create_update_serializer_class
        elif self.action == 'list':
            return self.serializer_class
        return super().get_serializer_class()
