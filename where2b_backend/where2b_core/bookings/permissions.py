from rest_framework.permissions import BasePermission
from django.contrib.auth.models import AnonymousUser


class IsBookingCreatorOrIsRestaurant(BasePermission):

	def has_object_permission(self, request, view, obj):

		if request.user is AnonymousUser:
			return False

		if request.user == obj.user.user:
			return not obj.is_finished
		else:
			restaurant_owner = obj.table.restaurant.owner
			return request.user == restaurant_owner.user