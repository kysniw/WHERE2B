from django.contrib import admin
from .models import CustomUser, RestaurantProfile, UserProfile


class CustomUserAdmin(admin.ModelAdmin):
   model = CustomUser

class RestaurantProfileAdmin(admin.ModelAdmin):
   model = RestaurantProfile


class UserProfileAdmin(admin.ModelAdmin):
   model = UserProfile


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(RestaurantProfile, RestaurantProfileAdmin)
admin.site.register(UserProfile, UserProfileAdmin)

