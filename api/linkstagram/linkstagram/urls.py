"""linkstagram URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from chat.consumers import ChatConsumer
from chat.views import ChatViewSet, MessageViewSet
from dead_profile.views import DeadProfileViewSet
from post.views import PostListViewSet, PostLikeViewSet, PostCommentViewSet, PostLikeDeleteAPIView
from user_profile.views import UserViewSet, UserFollowingViewSet, CurrentUserView, UserFollowingAPIView, \
    UserFollowersAPIView, UserFollowingDeleteAPIView, RandomUserRecommendations

router = routers.DefaultRouter()
router.register(r'posts', PostListViewSet, basename="postView")
router.register(r'users', UserViewSet, basename="userView")
router.register(r'user-following', UserFollowingViewSet, basename="userFollowingView")
router.register(r'likes', PostLikeViewSet, basename="likeView")
router.register(r'comments', PostCommentViewSet, basename="commentView")
router.register(r'chats', ChatViewSet, basename="chatView")
router.register(r'messages', MessageViewSet, basename="messageView")
router.register(r'dead-profiles', DeadProfileViewSet, basename="deadProfileView")


urlpatterns = [
    path(r'admin/', admin.site.urls),
    path(r'users/me/', CurrentUserView.as_view()),
    path(r'api/', include(router.urls)),
    path(r'api/token-auth/', obtain_auth_token, name='api_token_auth'),

    path(r'api/users/following/<int:user_id>', UserFollowingAPIView.as_view()),
    path(r'api/users/following-delete/<int:user_id>/<int:user_following_id>', UserFollowingDeleteAPIView.as_view()),
    path(r'api/users/followers/<int:user_id>', UserFollowersAPIView.as_view()),
    path(r'api/users/random', RandomUserRecommendations.as_view()),

    path(r'api/likes-delete/<str:post_id>/<str:user_id>/', PostLikeDeleteAPIView.as_view(), name="likeDeleteView"),
]

websocket_urlpatterns = [
    re_path(r'ws/(?P<chat_id>\w+)/$', ChatConsumer.as_asgi()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
