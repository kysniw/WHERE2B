def is_restaurant(user):

	if hasattr(user, 'restaurantprofile'):
		return True
	else:
		return False