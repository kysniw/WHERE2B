from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from users.models import UserProfile
from restaurants.models import Restaurant

class Rating(models.Model):
	rating = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
     )
	user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False, blank=False)
	restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=False, blank=False)
	description = models.TextField(null=True, blank=True)

	class Meta:
		unique_together = [['user', 'restaurant']]
	