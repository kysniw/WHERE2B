from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import UserProfileViewSet, RestaurantProfileViewSet, TokenObtainPairWithIdView


router = routers.SimpleRouter()
router.register(r'user-profile', UserProfileViewSet, basename='user-profile')
router.register(r'restaurant-profile', RestaurantProfileViewSet, basename='restaurant-profile')

urlpatterns = [
	path('login/tokens/', TokenObtainPairWithIdView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('', include(router.urls))
]

