from rest_framework import serializers
from django.db import transaction

from .models import RestaurantCategory, Restaurant, Table
from recommendations.models import Recommendation
from ratings.models import Rating
from django.db.models import Avg
from users.utils import has_userprofile


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


class ListRestaurantSerializer(RestaurantSerializer):

    predicted_rating = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    def get_predicted_rating(self, obj):
        request = self.context['request']
        user = request.user

        if has_userprofile(user):
            recommendation = Recommendation.objects.filter(user=user.userprofile, restaurant=obj)
            if recommendation:
                return recommendation.first().predicted_rating

        return None

    def get_rating(self, obj):

        ratings = Rating.objects.filter(restaurant=obj)
        if ratings:
            rating_avg = ratings.aggregate(Avg('rating'))
            return rating_avg['rating__avg']
        else:
            return None



class TableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Table
        fields = '__all__'