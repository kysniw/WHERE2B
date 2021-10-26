from django.shortcuts import render
from rest_framework import viewsets
from .models import UserProfile, RestaurantProfile
from .serializers import UserProfileSerializer, RestaurantProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):

	queryset = UserProfile.objects.all()
	serializer_class = UserProfileSerializer

class RestaurantProfileViewSet(viewsets.ModelViewSet):

	queryset = RestaurantProfile.objects.all()
	serializer_class = RestaurantProfileSerializer