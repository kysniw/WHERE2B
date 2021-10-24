from django.contrib import admin
from .models import CustomUser, RestaurantProfile, UserProfile

admin.site.register(CustomUser)
admin.site.register(RestaurantProfile)
admin.site.register(UserProfile)