from django.urls import path, include
from rest_framework import routers

from .views import ListRestaurantCategoriesViewSet, RestaurantViewSet

router = routers.SimpleRouter()
router.register(r'restaurant-categories', ListRestaurantCategoriesViewSet, basename='restaurant-categories')
router.register(r'restaurant', RestaurantViewSet, basename='restaurant')

urlpatterns = [
	path('', include(router.urls))
]