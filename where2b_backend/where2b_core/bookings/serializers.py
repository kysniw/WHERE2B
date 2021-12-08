from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from .models import Booking
from restaurants.serializers import TableSerializer
from users.utils import has_restaurantprofile


class BookingSerializer(serializers.ModelSerializer):

	class Meta:
		model = Booking
		fields = '__all__'
		read_only_fields = ['id',]

class CreateBookingSerializer(serializers.ModelSerializer):

	class Meta:
		model = Booking
		fields = ['table', 'date']

class UpdateBookingSerializer(serializers.ModelSerializer):

	def validate(self, data):

		user = self.context['request'].user
		if not has_restaurantprofile(user):

			for key in data:
				if key in self.fields and key != 'is_finished':
					raise ValidationError({key: _("You can't change that field value.")}) 

		return data

	class Meta:
		model = Booking
		fields = '__all__'


class ReadBookingSerializer(serializers.ModelSerializer):

	restaurant = serializers.SerializerMethodField()

	def get_restaurant(self, obj) -> int:
		return obj.table.restaurant.id

	class Meta:
		model = Booking
		fields = '__all__'


class AvailableTablesSerializer(serializers.Serializer):

	date = serializers.DateTimeField()
	tables = TableSerializer(many=True)