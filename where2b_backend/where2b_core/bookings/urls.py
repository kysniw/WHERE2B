from django.urls import path, include
from rest_framework import routers

from .views import BookingsViewSet, ListBookingsView, ListAvailableSeatsView

router = routers.SimpleRouter()
router.register(r'booking', BookingsViewSet, basename='booking')

urlpatterns = [
	path('', include(router.urls)),
	path('list-bookings/<int:restaurant_id>/', ListBookingsView.as_view(), name='list-bookings'),
	path('list-available-seats/<int:restaurant_id>/<str:date>/<int:people_count>/', ListAvailableSeatsView.as_view(), name='list-available-seats')
]