from rest_framework import viewsets, permissions, generics
import django_filters
from django.contrib.auth import get_user_model

from user_profile.models import UserProfile, UserFollowing
from user_profile.serializers import UserSerializer, UserBriefSerializer, UserCreateUpdateSerializer, \
    UserFollowingListSerializer, UserFollowingCreateSerializer

UserModel = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    list_serializer_class = UserBriefSerializer
    create_update_serializer_class = UserCreateUpdateSerializer

    def get_serializer_class(self):
        if self.action in ('create', 'destroy', 'update', 'partial_update'):
            return self.create_update_serializer_class
        elif self.action == 'list':
            return self.list_serializer_class
        return super().get_serializer_class()

    def get_permissions(self):
        # TODO: change to ReadOnlyOrIsAuthenticated
        if self.action in ('update', 'destroy', 'partial_update'):
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def perform_update(self, serializer):
        instance = serializer.save()
        first_name = serializer.context['request'].data.get('first_name')
        last_name = serializer.context['request'].data.get('last_name')
        username = serializer.context['request'].user.username
        user = UserModel.objects.get(username=username)
        if first_name:
            instance.user.first_name = first_name
            user.first_name = first_name
        if last_name:
            instance.user.last_name = last_name
            user.last_name = last_name
        user.save()
        instance.save()


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all()

    def get_object(self):
        print(self)
        return self.get_queryset().filter(user_id=self.request.user.pk).first()


class UserFollowingViewSet(viewsets.ModelViewSet):
    queryset = UserFollowing.objects.all()
    serializer_class = UserFollowingListSerializer
    create_serializer_class = UserFollowingCreateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ('create', 'destroy'):
            if hasattr(self, 'create_serializer_class'):
                return self.create_serializer_class
        elif self.action == 'list':
            return self.serializer_class
        return super().get_serializer_class()

    def perform_create(self, serializer):
        curr_user_data = serializer.validated_data['user']
        user_to_follow_data = serializer.validated_data['following_user']

        user_to_follow_profile = UserProfile.objects.get(id=user_to_follow_data.id)
        curr_user_profile = UserProfile.objects.get(id=curr_user_data.id)
        user_to_follow_profile.increment_followers()
        curr_user_profile.increment_following()

        instance = serializer.save()
        instance.save()

    def perform_destroy(self, instance):
        curr_user_id = instance.user.id
        user_to_follow_id = instance.following_user.id

        curr_user_profile = UserProfile.objects.get(id=curr_user_id)
        user_to_follow_profile = UserProfile.objects.get(id=user_to_follow_id)
        curr_user_profile.decrement_following()
        user_to_follow_profile.decrement_followers()

        instance.delete()
