from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters import rest_framework as filters
from rest_framework import filters as rest_filters

from .models import RestaurantCategory, Restaurant, Table
from .serializers import (
    RestaurantCategorySerializer,
    RestaurantSerializer,
    TableSerializer,
    ListRestaurantSerializer
)
from .permissions import IsRestaurantOwner
from users.permissions import HasRestaurantProfile


class ListRestaurantCategoriesViewSet(mixins.ListModelMixin,
                                viewsets.GenericViewSet):
  
    serializer_class = RestaurantCategorySerializer
    queryset = RestaurantCategory.objects.all()

class RestaurantViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsRestaurantProfile]
        elif self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsRestaurantProfile, IsRestaurantOwner]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'list':
            return ListRestaurantSerializer
        else:
            return RestaurantSerializer

    queryset = Restaurant.objects.all()
    filter_backends = [filters.DjangoFilterBackend, rest_filters.OrderingFilter]
    filterset_fields = ['categories', ]
    ordering_fields = ['predicted_rating', ]


class TableViewSet(viewsets.ModelViewSet):

    permission_classes = [IsRestaurantOwner]
    queryset = Table.objects.all()
    serializer_class = TableSerializer