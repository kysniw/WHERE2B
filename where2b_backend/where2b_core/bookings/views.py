from rest_framework import viewsets, mixins
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import datetime, timedelta
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.db.models import Q

from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer, UpdateBookingSerializer
from restaurants.models import Restaurant, Table
from restaurants.permissions import IsRestaurantOwner
from .permissions import IsBookingCreatorOrIsRestaurant
from restaurants.serializers import TableSerializer
from users.permissions import HasUserProfile


class BookingsViewSet(viewsets.GenericViewSet,
	mixins.CreateModelMixin,
	mixins.RetrieveModelMixin,
	mixins.UpdateModelMixin,
	mixins.DestroyModelMixin,
	):

	queryset = Booking.objects.all()
	serializer_class = BookingSerializer

	@swagger_auto_schema(responses={201: BookingSerializer(many=False)})
	def create(self, request, *args, **kwargs):
		user = request.user.userprofile
		data = {**request.data, 'user': user}
		serializer = BookingSerializer(data=data)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		return Response(serializer.data, status=status.HTTP_201_CREATED)

	def get_permissions(self):

		if self.action == 'create':
		    permission_classes = [IsAuthenticated, HasUserProfile]
		else:
			permission_classes = [IsBookingCreatorOrIsRestaurant]

		return [permission() for permission in permission_classes]

	def get_serializer_class(self):

		if self.action == 'create':
			return CreateBookingSerializer
		elif self.action in ['update', 'partial_update']:
			return UpdateBookingSerializer
		else:
			return BookingSerializer


class ListBookingsView(generics.GenericAPIView):

	permission_classes = [IsRestaurantOwner]
	serializer_class = BookingSerializer
	queryset = Booking.objects.all()

	def get(self, request, restaurant_id):
		restaurant = get_object_or_404(Restaurant, id=restaurant_id)
		self.check_object_permissions(self.request, restaurant)
		bookings = self.queryset.filter(table__restaurant=restaurant)
		serializer = BookingSerializer(bookings, many=True)
		return Response(serializer.data)


class ListAvailableSeatsView(generics.GenericAPIView):

	permission_classes = [AllowAny]
	serializer_class = BookingSerializer
	queryset = Booking.objects.all()

	def get(self, request, restaurant_id, date, people_count):
		
		date = datetime.strptime(date, '%Y-%m-%dT%H:%M')
		lower_date = date - timedelta(hours=2)	
		upper_date = date + timedelta(hours=2)	

		bookings = Booking.objects.select_related('table').filter(
			(Q(lower_date__gte=lower_date) & Q(upper_date__gte=upper_date) & Q(lower_date__lte=upper_date))
			| (Q(lower_date__lte=lower_date) & Q(upper_date__lte=upper_date) & Q(upper_date__gte=lower_date))
			| (Q(lower_date__lte=lower_date) & Q(upper_date__gte=upper_date))
			| (Q(lower_date__gte=lower_date) & Q(upper_date__lte=upper_date)))
		
		booked_tables = [booking.table.id for booking in bookings]
		tables = Table.objects.filter(restaurant=restaurant_id, number_of_seats__gte=people_count
			).exclude(id__in=booked_tables)

		serializer = TableSerializer(tables, many=True)
		return Response(serializer.data)