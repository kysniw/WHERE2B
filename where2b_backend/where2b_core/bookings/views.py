from rest_framework import viewsets, mixins
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from datetime import datetime, timedelta
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.db.models import Q
import pytz

from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer, UpdateBookingSerializer, AvailableTablesSerializer
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

	queryset = Booking.objects.filter(is_finished=False)
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
		bookings = self.queryset.filter(table__restaurant=restaurant, is_finished=False)
		serializer = BookingSerializer(bookings, many=True)
		return Response(serializer.data)


class ListAvailableSeatsView(generics.GenericAPIView):

	permission_classes = [AllowAny]
	serializer_class = AvailableTablesSerializer
	queryset = Booking.objects.all()

	def get(self, request, restaurant_id, date, people_count):
		
		date = datetime.strptime(date, '%Y-%m-%dT%H:%M')
		date = date.replace(second=0, microsecond=0, minute=0, hour=date.hour)
            
		tables_dates = []


		def get_available_tables(restaurant_id, booking_date, people_count):

			lower_date = booking_date - timedelta(hours=1, minutes=30)	
			upper_date = booking_date + timedelta(hours=1, minutes=30)	

			lower_date = pytz.utc.localize(lower_date)
			upper_date = pytz.utc.localize(upper_date)

			bookings = Booking.objects.select_related('table').filter(
				(Q(lower_date__gte=lower_date) & Q(upper_date__gte=upper_date) & Q(lower_date__lte=upper_date))
				| (Q(lower_date__lte=lower_date) & Q(upper_date__lte=upper_date) & Q(upper_date__gte=lower_date))
				| (Q(lower_date__lte=lower_date) & Q(upper_date__gte=upper_date))
				| (Q(lower_date__gte=lower_date) & Q(upper_date__lte=upper_date)))
			
			print(f'DATE {booking_date}, bookings: {len(bookings)}')

			booked_tables = [booking.table.id for booking in bookings if not booking.is_finished]
			tables = Table.objects.filter(restaurant=restaurant_id, number_of_seats__gte=people_count,
				number_of_seats__lte=people_count+5).exclude(id__in=booked_tables)

			if tables:
				tables = tables.order_by('number_of_seats')
				return [tables.first()]
			else:
				return []

			# else:
			# 	tables = Table.objects.filter(restaurant=restaurant_id).exclude(id__in=booked_tables).order_by('-number_of_seats')
			# 	available_tables = []
			# 	seats_count = 0
				
			# 	for table in tables:
			# 		available_tables.append(table)
			# 		seats_count += table.number_of_seats

			# 		if seats_count >= people_count:
			# 			return available_tables

			# return []


		for i in range(1, 10):
			current_date = date + timedelta(minutes=i*30)
			available_tables = get_available_tables(restaurant_id, current_date, people_count)
			table_date = {'date': current_date, 'tables': available_tables}
			tables_dates.append(table_date)

		serializer = AvailableTablesSerializer(tables_dates, many=True)
		return Response(serializer.data)