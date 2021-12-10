from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters import rest_framework as filters
from rest_framework import filters as rest_filters
from rest_framework.response import Response
from django.db import transaction
from rest_framework import status
from rest_framework import generics
from django.shortcuts import get_object_or_404

from .models import RestaurantCategory, Restaurant, Table, OpeningHours, RestaurantPhoto
from .serializers import (
    RestaurantCategorySerializer,
    RestaurantSerializer,
    TableSerializer,
    ListRestaurantSerializer,
    OpeningHoursSerializer
)
from .permissions import IsRestaurantOwner
from users.permissions import HasRestaurantProfile
from .responses import ImageResponse


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

    def get_serializer_class(self):
        if self.action == 'list':
            return ListRestaurantSerializer
        else:
            return RestaurantSerializer

    queryset = Restaurant.objects.all()
    filter_backends = [filters.DjangoFilterBackend, rest_filters.OrderingFilter]
    filterset_fields = ['categories', ]
    ordering_fields = ['predicted_rating', ]


class TableViewSet(viewsets.GenericViewSet,
                    mixins.ListModelMixin,
                    mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin):

    permission_classes = [IsRestaurantOwner]
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['restaurant', ]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
    
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


class OpeningHoursViewSet(viewsets.GenericViewSet,
                    mixins.ListModelMixin,
                    mixins.CreateModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin):

    queryset = OpeningHours.objects.all()
    serializer_class = OpeningHoursSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = ['restaurant', ]

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [HasRestaurantProfile]
        return [permission() for permission in permission_classes]


    @transaction.atomic
    def create(self, request, *args, **kwargs):
    
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )



class ListUserRestaurantsViewSet(mixins.ListModelMixin,
                                viewsets.GenericViewSet):
  
    permission_classes = [HasRestaurantProfile,]
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Restaurant.objects.filter(owner=user.restaurantprofile)
        return queryset



class GetImageView(generics.GenericAPIView):

    permission_classes = [AllowAny]

    def get(self, request, pk):
        restaurant_photo = get_object_or_404(RestaurantPhoto, pk=pk)
        return ImageResponse(restaurant_photo.image)