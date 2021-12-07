from django.db import models
from datetime import timedelta

from restaurants.models import Restaurant, Table
from users.models import UserProfile


class Booking(models.Model):
	table = models.ForeignKey(Table, on_delete=models.CASCADE, null=False, blank=False)
	user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=False, blank=False)
	date = models.DateTimeField(null=False, blank=False)
	lower_date = models.DateTimeField(null=True, blank=True)
	upper_date = models.DateTimeField(null=True, blank=True)
	is_accepted = models.BooleanField(default=False, null=False, blank=False)
	is_finished = models.BooleanField(default=False, null=False, blank=False)

	def save(self, *args, **kwargs):
		self.lower_date = self.date - timedelta(hours=1, minutes=30)
		self.upper_date = self.date + timedelta(hours=1, minutes=30)
		super(Booking, self).save(*args, **kwargs)