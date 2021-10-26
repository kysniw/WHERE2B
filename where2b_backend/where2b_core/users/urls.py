from django.urls import path, include
from rest_framework import routers
from .views import UserProfileViewSet, RestaurantProfileViewSet

router = routers.SimpleRouter()
router.register(r'user-profile', UserProfileViewSet, basename='user-profile')
router.register(r'restaurant-profile', RestaurantProfileViewSet, basename='restaurant-profile')

urlpatterns = [
	path('', include(router.urls))
]