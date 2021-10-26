from django.shortcuts import render
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .models import UserProfile, RestaurantProfile
from .serializers import UserProfileSerializer, RestaurantProfileSerializer, SignInSerializer
from .permissions import IsSelf


class UserProfileViewSet(viewsets.ModelViewSet):

	queryset = UserProfile.objects.all()
	serializer_class = UserProfileSerializer

class RestaurantProfileViewSet(viewsets.ModelViewSet):

	queryset = RestaurantProfile.objects.all()
	serializer_class = RestaurantProfileSerializer

	def get_permissions(self):
		if self.action == 'list':
		    permission_classes = [IsAdminUser()]
		else:
			permission_classes = [IsSelf()]

		return permission_classes



class TokenObtainPairWithIdView(TokenObtainPairView):
	
	serializer_class = SignInSerializer

	def post(self, request):

		serializer = self.serializer_class(data=request.data)
		user = serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']

		refresh = RefreshToken.for_user(user)

		return Response({
			'user_id': user.id,
		    'refresh': str(refresh),
		    'access': str(refresh.access_token),
		})
