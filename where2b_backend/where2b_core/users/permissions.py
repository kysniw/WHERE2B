from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser

from .models import RestaurantProfile


class IsSelf(BasePermission):

	def has_object_permission(self, request, view, obj):

		if request.user is AnonymousUser:
			return False

		return request.user == obj.user


class IsRestaurantProfile(BasePermission):

    def has_permission(self, request, view):
        
        user_id = request.user.id
        restaurnat_profile_exists = RestaurantProfile.objects.filter(user_id=user_id).exists() 
        return restaurnat_profile_exists