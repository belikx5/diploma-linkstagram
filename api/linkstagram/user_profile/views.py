from rest_framework import viewsets
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

from user_profile.models import UserProfile
from user_profile.serializers import UserSerializer, UserBriefSerializer, UserCreateUpdateSerializer

UserModel = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    list_serializer_class = UserBriefSerializer
    create_update_serializer_class = UserCreateUpdateSerializer

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            return self.create_update_serializer_class
        elif self.action == 'list':
            if hasattr(self, 'list_serializer_class'):
                return self.list_serializer_class
        return super().get_serializer_class()

    def get_permissions(self):
        if self.action in ('create', 'update', 'destroy', 'partial_update'):
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
