from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.utils.translation import ugettext_lazy as _

from .models import Rating
from users.models import UserProfile

class RatingSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Rating
		fields = '__all__'
		read_only_fields = ['id',]


class CreateRatingSerializer(serializers.ModelSerializer):


	class Meta:
		model = Rating
		fields = ['restaurant', 'rating', 'description']
		read_only_fields = ['id', 'user', ]


class ReadRatingSerializer(RatingSerializer):
	
	username = serializers.SerializerMethodField()

	def get_username(self, obj):
		username = obj.user.user.username
		if username:
			return username
		else:
			return _('Anonymous user')

	class Meta:
		model = Rating
		fields = ['id', 'user', 'username', 'restaurant', 'rating', 'description']
		read_only_fields = ['id',]