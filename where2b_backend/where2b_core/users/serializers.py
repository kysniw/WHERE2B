from rest_framework import serializers
from django.db import transaction

from .models import CustomUser, UserProfile, RestaurantProfile


class UserSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'email', 'password']
		read_only_fields = ['id',]


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
		read_only_fields = ['id',]


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