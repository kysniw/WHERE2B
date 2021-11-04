from django.urls import path, include
from rest_framework import routers

from .views import RatingViewSet

router = routers.SimpleRouter()
router.register(r'rating', RatingViewSet, basename='rating')

urlpatterns = [
	path('', include(router.urls)),
]