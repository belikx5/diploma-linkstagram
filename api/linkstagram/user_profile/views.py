from rest_framework import viewsets

from user_profile.models import UserProfile
from user_profile.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
