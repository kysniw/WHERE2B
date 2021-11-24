from django.urls import path, include
from rest_framework import routers

from .views import (
	ListRestaurantCategoriesViewSet,
	RestaurantViewSet,
	TableViewSet,
	ListUserRestaurantsViewSet,
)

router = routers.SimpleRouter()
router.register(r'restaurant-categories', ListRestaurantCategoriesViewSet, basename='restaurant-categories')
router.register(r'restaurant', RestaurantViewSet, basename='restaurant')
router.register(r'table', TableViewSet, basename='table')
router.register(r'user-restaurants', ListUserRestaurantsViewSet, basename='user-restaurants')

urlpatterns = [
	path('', include(router.urls))
]