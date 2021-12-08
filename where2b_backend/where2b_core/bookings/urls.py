from django.urls import path, include
from rest_framework import routers

from .views import BookingsViewSet, ListRestaurateurBookingsView, ListUserBookingsView, ListAvailableSeatsView

router = routers.SimpleRouter()
router.register(r'booking', BookingsViewSet, basename='booking')

urlpatterns = [
	path('', include(router.urls)),
	path('restaurateur-bookings/<int:restaurant_id>/', ListRestaurateurBookingsView.as_view(), name='list-restaurateur-bookings'),
	path('user-bookings/', ListUserBookingsView.as_view(), name='list-user-bookings'),
	path('list-available-seats/<int:restaurant_id>/<str:date>/<int:people_count>/', ListAvailableSeatsView.as_view(), name='list-available-seats')
]