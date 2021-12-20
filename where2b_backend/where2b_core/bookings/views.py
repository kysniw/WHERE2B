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
from rest_framework.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django_filters import rest_framework as filters


from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer, UpdateBookingSerializer, AvailableTablesSerializer, ReadBookingSerializer
from restaurants.models import Restaurant, Table, OpeningHours
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


class ListRestaurateurBookingsView(generics.ListAPIView):

	permission_classes = [IsRestaurantOwner]
	
	serializer_class = BookingSerializer
	queryset = Booking.objects.all()
	filter_backends = [filters.DjangoFilterBackend]
	filterset_fields = ['is_finished', ]

	def get_queryset(self):
		restaurant = self.get_restaurant()
		return Booking.objects.filter(table__restaurant=restaurant)

	def get_restaurant(self):
		restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
		self.check_object_permissions(self.request, restaurant)
		return restaurant


class ListUserBookingsView(generics.ListAPIView):

	permission_classes = [IsAuthenticated, HasUserProfile]
	serializer_class = ReadBookingSerializer
	queryset = Booking.objects.all()
	filter_backends = [filters.DjangoFilterBackend]
	filterset_fields = ['is_finished', ]

	def get_queryset(self):
		user = self.request.user
		return Booking.objects.filter(user__user=user)


class ListAvailableSeatsView(generics.GenericAPIView):

	permission_classes = [AllowAny]
	serializer_class = AvailableTablesSerializer
	queryset = Booking.objects.all()

	def get(self, request, restaurant_id, date, people_count):
		
		date = datetime.strptime(date, '%Y-%m-%dT%H:%M')
		date = pytz.utc.localize(date)

		if date < timezone.now():
			raise ValidationError(_('Date must be an upcoming date.'))

		weekday = date.weekday() + 1

		opening_hours = OpeningHours.objects.filter(restaurant=restaurant_id, weekday=weekday)
		if not opening_hours:
			raise ValidationError(_('This restaurant is closed on this day.')) 

		opening_hours = opening_hours.first()
		open_from = opening_hours.open_from
		open_till = opening_hours.open_till
		open_till = date.replace(second=0, microsecond=0, minute=open_till.minute, hour=open_till.hour) - timedelta(hours=1, minutes=30)

		if date.hour < open_from.hour:
			start_hour = date.replace(second=0, microsecond=0, minute=open_from.minute, hour=open_from.hour)
			start_hour = start_hour + timedelta(minutes=30)
			if start_hour.minute > 30:
				start_hour = start_hour.replace(minute=30)
			else:
				start_hour = start_hour.replace(minute=0)
		else:
			start_hour = date.replace(second=0, microsecond=0, minute=0, hour=date.hour)

            
		tables_dates = []

		def get_available_tables(restaurant_id, booking_date, people_count):

			# lower_date = booking_date - timedelta(hours=1, minutes=30)	
			upper_date = booking_date + timedelta(hours=1, minutes=30)	

			# lower_date = pytz.utc.localize(lower_date)
			# upper_date = pytz.utc.localize(upper_date)

			bookings = Booking.objects.select_related('table').filter(
				(Q(date__gte=booking_date) & Q(upper_date__gte=upper_date) & Q(date__lte=upper_date))
				| (Q(date__lte=booking_date) & Q(upper_date__lte=upper_date) & Q(upper_date__gte=booking_date))
				| (Q(date__lte=booking_date) & Q(upper_date__gte=upper_date))
				| (Q(date__gte=booking_date) & Q(date__lte=upper_date)))
			
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

		booking_date = start_hour	
		while booking_date <= open_till:	
			available_tables = get_available_tables(restaurant_id, booking_date, people_count)
			table_date = {'date': booking_date, 'tables': available_tables}
			tables_dates.append(table_date)
			booking_date = booking_date + timedelta(minutes=30)

		serializer = AvailableTablesSerializer(tables_dates, many=True)
		return Response(serializer.data)