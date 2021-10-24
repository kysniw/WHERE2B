from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    email = models.EmailField(help_text=_('email address'), unique=True)
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

class RestaurantProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(help_text=_('name'), max_length=250, null=False, blank=True)


