from django.urls import path, include
from rest_framework import routers

from .views import (
    UserProfileViewSet,
    RestaurantProfileViewSet,
    DecoratedTokenObtainPairWithIdView,
    DecoratedTokenRefreshView
)


router = routers.SimpleRouter()
router.register(r'user-profile', UserProfileViewSet, basename='user-profile')
router.register(r'restaurant-profile', RestaurantProfileViewSet, basename='restaurant-profile')

urlpatterns = [
	path('login/tokens/', DecoratedTokenObtainPairWithIdView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', DecoratedTokenRefreshView.as_view(), name='token_refresh'),
	path('', include(router.urls))
]

