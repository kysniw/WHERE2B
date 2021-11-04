from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ValidationError
from django.db.models import Q

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    email = models.EmailField(help_text=_('email address'), unique=True)
    username = models.CharField(help_text=_('username'), max_length=160, unique=True, null=True, blank=True)
    first_name = None
    last_name = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()


    def __str__(self):
        return self.email


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(help_text=_('first name'), max_length=250, null=True, blank=True)
    last_name = models.CharField(help_text=_('last name'), max_length=250, null=True, blank=True)

    def clean(self):
        if hasattr(self, 'user'):
            if hasattr(self.user, 'restaurantprofile'):
                raise ValidationError(_('There is already profile associated with this user.'))

    def __str__(self):
        return self.user.email


class RestaurantProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    def clean(self):
        if hasattr(self, 'user'):
            if hasattr(self.user, 'userprofile'):
                raise ValidationError(_('There is already profile associated with this user.'))


    def __str__(self):
        return self.user.email
