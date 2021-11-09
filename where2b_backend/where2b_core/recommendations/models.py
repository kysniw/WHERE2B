from django.db import models

from restaurants.models import Restaurant
from users.models import UserProfile


class Recommendation(models.Model):
	user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False, blank=False)
	restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=False, blank=False)
	predicted_rating = models.FloatField(null=False, blank=False)

	class Meta:
		unique_together = [['user', 'restaurant']]