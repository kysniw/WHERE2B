def has_restaurantprofile(user):

	if hasattr(user, 'restaurantprofile'):
		return True
	else:
		return False

def has_userprofile(user):

	if hasattr(user, 'userprofile'):
		return True
	else:
		return False