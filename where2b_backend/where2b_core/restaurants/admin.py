from django.contrib import admin
from .models import RestaurantCategory, Restaurant, Table, OpeningHours, RestaurantPhoto


class OpeningHoursAdmin(admin.TabularInline):
   model = OpeningHours

class TableAdmin(admin.TabularInline):
   model = Table

class RestaurantPhotoAdmin(admin.TabularInline):
   model = RestaurantPhoto

class RestaurantAdmin(admin.ModelAdmin):
   inlines = [OpeningHoursAdmin, TableAdmin, RestaurantPhotoAdmin]
   filter_horizontal = ['categories',]


admin.site.register(RestaurantCategory)
admin.site.register(Restaurant, RestaurantAdmin)

