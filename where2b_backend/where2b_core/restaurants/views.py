from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import RestaurantCategory, Restaurant, Table
from .serializers import RestaurantCategorySerializer, RestaurantSerializer, TableSerializer
from .permissions import IsRestaurantOwner
from users.permissions import HasRestaurantProfile


class ListRestaurantCategoriesViewSet(mixins.ListModelMixin,
                                viewsets.GenericViewSet):
  
    serializer_class = RestaurantCategorySerializer
    queryset = RestaurantCategory.objects.all()


class RestaurantViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, HasRestaurantProfile]
        elif self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [HasRestaurantProfile, IsRestaurantOwner]
        return [permission() for permission in permission_classes]

    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class TableViewSet(viewsets.ModelViewSet):

    permission_classes = [IsRestaurantOwner]
    queryset = Table.objects.all()
    serializer_class = TableSerializer
