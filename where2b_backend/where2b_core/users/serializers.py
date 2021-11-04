from rest_framework import serializers
from django.db import transaction
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from .models import CustomUser, UserProfile, RestaurantProfile


class UserSerializer(serializers.ModelSerializer):
	
	def create(self, validated_data):
		user = CustomUser(**validated_data)
		user.set_password(validated_data['password'])
		user.save()
		return user

	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'email', 'password']
		read_only_fields = ['id',]
		extra_kwargs = {
            'password': {'write_only': True}
        }


class UserProfileSerializer(serializers.ModelSerializer):

	user = UserSerializer()

	@transaction.atomic
	def create(self, validated_data):
        
		user_data = validated_data.pop('user')
		user_serializer = UserSerializer(data=user_data)
		user_serializer.is_valid(raise_exception=True)
		user_serializer.save()

		return UserProfile.objects.create(**validated_data, user=user_serializer.instance)

	class Meta:
		model = UserProfile
		fields = '__all__'


class UpdateUserProfileSerializer(serializers.ModelSerializer):


	class Meta:
		model = UserProfile
		fields = ['first_name', 'last_name',]


class RestaurantProfileSerializer(serializers.ModelSerializer):

	user = UserSerializer()

	@transaction.atomic
	def create(self, validated_data):
        
		user_data = validated_data.pop('user')
		user_serializer = UserSerializer(data=user_data)
		user_serializer.is_valid(raise_exception=True)
		user_serializer.save()

		return RestaurantProfile.objects.create(**validated_data, user=user_serializer.instance)

	class Meta:
		model = RestaurantProfile
		fields = '__all__'
		read_only_fields = ['id',]


class SignInSerializer(serializers.Serializer):

	login = serializers.CharField(max_length=250, required=True, allow_blank=False)
	password = serializers.CharField(max_length=500, required=True, allow_blank=False)

	def validate(self, data):

		try:
			login = data['login']
			password = data['password']
			user = CustomUser.objects.get(Q(username=login)|Q(email=login))
	
			if user.check_password(password):
				data['user'] = user
				return data

		except CustomUser.DoesNotExist:
			raise ValidationError(_('Wrong credentials.'))

		raise ValidationError(_('Wrong credentials.'))


class ResponseTokensSerializer(serializers.Serializer):

	user_id = serializers.IntegerField()
	refresh = serializers.CharField(max_length=500)
	access = serializers.CharField(max_length=500)

class ResponseTokenRefreshSerializer(serializers.Serializer):
	access = serializers.CharField(max_length=500)