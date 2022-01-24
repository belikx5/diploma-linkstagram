from rest_framework import viewsets
from django.contrib.auth import get_user_model

from user_profile.models import UserProfile
from user_profile.serializers import UserSerializer

UserModel = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer

    # def perform_create(self, serializer):
    #
    #     user = UserModel.objects.create_user(
    #         username=serializer.validated_data.get('username'),
    #         password=serializer.validated_data.get('password')
    #     )
    #
    #     serializer.user = user
    #     instance = serializer.save()
    #     instance.save()
