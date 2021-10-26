from django.contrib import admin
from .models import RestaurantCategory, Restaurant, Table, OpeningHours


class OpeningHoursAdmin(admin.TabularInline):
   model = OpeningHours

class TableAdmin(admin.TabularInline):
   model = Table

class RestaurantAdmin(admin.ModelAdmin):
   inlines = [OpeningHoursAdmin, TableAdmin]
   filter_horizontal = ['categories',]


admin.site.register(RestaurantCategory)
admin.site.register(Restaurant, RestaurantAdmin)

