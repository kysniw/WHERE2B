from rest_framework import viewsets
from rest_framework import mixins

from .models import RestaurantCategory, Restaurant
from .serializers import RestaurantCategorySerializer, RestaurantSerializer


class ListRestaurantCategoriesViewSet(mixins.ListModelMixin,
                                viewsets.GenericViewSet):
  
    serializer_class = RestaurantCategorySerializer
    queryset = RestaurantCategory.objects.all()


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
