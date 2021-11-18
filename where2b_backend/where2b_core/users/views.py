from django.shortcuts import render
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from drf_yasg.utils import swagger_auto_schema

from .models import UserProfile, RestaurantProfile
from .serializers import (
	UserProfileSerializer,
	UpdateUserProfileSerializer,
	RestaurantProfileSerializer,
	SignInSerializer,
	ResponseTokensSerializer,
	ResponseTokenRefreshSerializer
)
from .permissions import IsSelf
from .utils import is_restaurant


class UserProfileViewSet(viewsets.ModelViewSet):

	queryset = UserProfile.objects.all()
	# serializer_class = UserProfileSerializer

	def get_permissions(self):
		if self.action == 'list':
		    permission_classes = [IsAdminUser()]
		else:
			permission_classes = [IsSelf()]

		return permission_classes

	def get_serializer_class(self):
		if self.action in ['update', 'partial_update']:
			return UpdateUserProfileSerializer
		else:
			return UserProfileSerializer


class RestaurantProfileViewSet(viewsets.ModelViewSet):

	queryset = RestaurantProfile.objects.all()
	serializer_class = RestaurantProfileSerializer

	def get_permissions(self):
		if self.action == 'list':
		    permission_classes = [IsAdminUser()]
		else:
			permission_classes = [IsSelf()]

		return permission_classes



class DecoratedTokenObtainPairWithIdView(TokenObtainPairView):
	
	serializer_class = SignInSerializer

	@swagger_auto_schema(responses={200: ResponseTokensSerializer(many=False)})
	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		user = serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']

		refresh = RefreshToken.for_user(user)
		data = {
			'user_id': user.id,
		    'refresh': str(refresh),
		    'access': str(refresh.access_token),
		    'is_restaurant_profile': is_restaurant(user)
		}

		serializer = ResponseTokensSerializer(data=data)
		serializer.is_valid(raise_exception=True)

		return Response(serializer.data)


class DecoratedTokenRefreshView(TokenRefreshView):
    
    @swagger_auto_schema(responses={200: ResponseTokenRefreshSerializer})
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

