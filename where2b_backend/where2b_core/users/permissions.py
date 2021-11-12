from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser

from .models import UserProfile, RestaurantProfile


class IsSelf(BasePermission):

	def has_object_permission(self, request, view, obj):

		if request.user is AnonymousUser:
			return False

		return request.user == obj.user


class HasUserProfile(BasePermission):

    def has_permission(self, request, view):
        
        user_id = request.user.id
        user_profile_exists = UserProfile.objects.filter(user_id=user_id).exists() 
        return user_profile_exists


class HasRestaurantProfile(BasePermission):

    def has_permission(self, request, view):
        
        user_id = request.user.id
        restaurnat_profile_exists = RestaurantProfile.objects.filter(user_id=user_id).exists() 
        return restaurnat_profile_exists