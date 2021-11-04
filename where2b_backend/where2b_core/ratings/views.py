from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import mixins
from rest_framework.generics import GenericAPIView
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from django_filters import rest_framework as filters
from rest_framework import filters as rest_filters

from .models import Rating
from .serializers import CreateRatingSerializer, RatingSerializer, ReadRatingSerializer
from .permissions import IsRatingCreator
from users.permissions import HasUserProfile



class RatingViewSet(viewsets.ModelViewSet):

	queryset = Rating.objects.all()
	serializer_class = RatingSerializer
	filter_backends = [filters.DjangoFilterBackend, rest_filters.OrderingFilter]
	filterset_fields = ['user', 'restaurant', 'rating']
	ordering_fields = ['rating', ]

	@swagger_auto_schema(responses={201: ReadRatingSerializer(many=False)})
	def create(self, request, *args, **kwargs):
		user = request.user.userprofile
		data = {**request.data, 'user': user}
		serializer = self.serializer_class(data=data)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		instance_serializer = ReadRatingSerializer(instance=serializer.instance)

		return Response(instance_serializer.data, status=status.HTTP_201_CREATED)

	def get_permissions(self):

		if self.action == 'create':
		    permission_classes = [HasUserProfile, IsAuthenticated]
		elif self.action == 'list':
			permission_classes = [AllowAny]
		else:
			permission_classes = [IsRatingCreator]

		return [permission() for permission in permission_classes]

	def get_serializer_class(self):

		if self.action == 'create':
			return CreateRatingSerializer
		elif self.action == 'list':
			return ReadRatingSerializer
		else:
			return RatingSerializer
