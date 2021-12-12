from django.urls import path, include
from rest_framework import routers

from .views import (
	ListRestaurantCategoriesViewSet,
	RestaurantViewSet,
	TableViewSet,
	ListUserRestaurantsViewSet,
	OpeningHoursViewSet,
	GetRestaurantPhotoImageView,
	RestaurantPhotoViewSet,
	UploadRestaurantPhotoView,
	RestaurantPhotoViewSet,
)

router = routers.SimpleRouter()
router.register(r'restaurant-categories', ListRestaurantCategoriesViewSet, basename='restaurant-categories')
router.register(r'restaurant', RestaurantViewSet, basename='restaurant')
router.register(r'table', TableViewSet, basename='table')
router.register(r'user-restaurants', ListUserRestaurantsViewSet, basename='user-restaurants')
router.register(r'opening-hours', OpeningHoursViewSet, basename='opening-hours')
router.register(r'restaurant-photo', RestaurantPhotoViewSet, basename='restaurant-photo')

urlpatterns = [
	path('', include(router.urls)),
	path('restaurant-photo-image/<int:pk>', GetRestaurantPhotoImageView.as_view(), name='restaurant-photo-image'),
	path('restaurant-photo-upload/', UploadRestaurantPhotoView.as_view(), name='restaurant-photo-upload')
]