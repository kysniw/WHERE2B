from rest_framework import serializers

from .models import RestaurantCategory, Restaurant

class RestaurantCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantCategory
        fields = ['id', 'name',]
        read_only_fields = ['id',]


class RestaurantSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Restaurant
        fields = '__all__'
