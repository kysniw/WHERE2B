from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser


class IsRestaurantOwner(BasePermission):

	def has_object_permission(self, request, view, obj):

		if request.user is AnonymousUser:
			return False

		return request.user == obj.owner.user
