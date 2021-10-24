from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

MyUser = get_user_model()

class EmailOrPasswordBackend(ModelBackend):

    def authenticate(self, request, username, password, **kwargs):

        try:
            user = MyUser.objects.get(Q(username=username)|Q(email=username))
            if user.check_password(password):
                return user
        except MyUser.DoesNotExist:
            return None



