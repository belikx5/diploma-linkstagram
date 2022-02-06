from rest_framework import viewsets, permissions

from dead_profile.models import DeadProfile
from dead_profile.serializers import DeadProfileSerializer, DeadProfileCreateSerializer, DeadProfileUpdateSerializer


class DeadProfileViewSet(viewsets.ModelViewSet):
    queryset = DeadProfile.objects.all()
    serializer_class = DeadProfileSerializer
    create_serializer_class = DeadProfileCreateSerializer
    update_serializer_class = DeadProfileUpdateSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ('create', 'destroy'):
            if hasattr(self, 'create_serializer_class'):
                return self.create_serializer_class
        elif self.action in ('update', 'partial_update'):
            if hasattr(self, 'update_serializer_class'):
                return self.update_serializer_class
        elif self.action == 'list':
            return self.serializer_class
        return super().get_serializer_class()
