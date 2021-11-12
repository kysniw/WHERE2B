from django.db import models
from django.utils.translation import ugettext_lazy as _

from users.models import RestaurantProfile


class RestaurantCategory(models.Model):

	name = models.CharField(help_text=_('Name'), max_length=250, unique=True, null=False, blank=False)

	def __str__(self):
		return self.name


class Restaurant(models.Model):

	name = models.CharField(help_text=_('Name'), max_length=500, null=False, blank=False)
	latitude = models.DecimalField(max_digits=10, decimal_places=7, default=0, null=False, blank=False)
	longitude = models.DecimalField(max_digits=10, decimal_places=7, default=0, null=False, blank=False)
	is_making_reservations = models.BooleanField(help_text=_('Is restaurant making reservations'), default=False, null=False, blank=False)
	max_number_of_people = models.PositiveIntegerField(help_text=_('Maximum number of people that can be in restaurant at given time'),
     null=True, blank=True)
	categories = models.ManyToManyField(RestaurantCategory, help_text=_('Categories of restaurant'))
	owner = models.ForeignKey(RestaurantProfile, default=None, on_delete=models.CASCADE, null=False, blank=False)
	is_verified = models.BooleanField(default=False, null=False, blank=False)

	def __str__(self):
		return self.name


WEEKDAYS = [
  (1, _("Monday")),
  (2, _("Tuesday")),
  (3, _("Wednesday")),
  (4, _("Thursday")),
  (5, _("Friday")),
  (6, _("Saturday")),
  (7, _("Sunday")),
]

class OpeningHours(models.Model):

	restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=False, blank=False)
	weekday = models.IntegerField(choices=WEEKDAYS, null=False, blank=False)
	open_from = models.TimeField(help_text=_('Open from'), null=False, blank=False)
	open_till = models.TimeField(help_text=_('Open till'), null=False, blank=False)

	class Meta:
		ordering = ('weekday', 'open_from')
		unique_together = ('restaurant', 'weekday')


class Table(models.Model):

	restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, null=False, blank=False)
	number_of_seats = models.PositiveIntegerField(help_text=_('Maximum number of people at the table'), null=False, blank=False)
	is_free = models.BooleanField(help_text=_('Is table free'), default=True, null=False, blank=False)
	is_outside = models.BooleanField(help_text=_('Is table outside'), default=False, null=False, blank=False)


	def __str__(self):
		if self.number_of_seats == 1:
			return f'Table for {self.number_of_seats} person.'
		else:
			return f'Table for {self.number_of_seats} people.'
