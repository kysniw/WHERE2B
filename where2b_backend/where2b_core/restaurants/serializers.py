from rest_framework import serializers
from django.db import transaction

from .models import RestaurantCategory, Restaurant

class RestaurantCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantCategory
        fields = ['id', 'name',]
        read_only_fields = ['id',]


class RestaurantSerializer(serializers.ModelSerializer):

    @transaction.atomic
    def create(self, validated_data):
        
        request = self.context.get('request')
        restaurnat_profile = request.user.restaurantprofile

        categories = validated_data.pop('categories')
        restaurant = Restaurant.objects.create(**validated_data, owner=restaurnat_profile)
        restaurant.categories.set(categories)

        return restaurant

    
    class Meta:
        model = Restaurant
        fields = '__all__'
        read_only_fields = ['id', 'owner', 'is_verified',]
