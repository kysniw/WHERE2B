from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import RestaurantCategory, Restaurant
from .serializers import RestaurantCategorySerializer, RestaurantSerializer
from .permissions import IsRestaurantOwner
from users.permissions import IsRestaurantProfile


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

    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
