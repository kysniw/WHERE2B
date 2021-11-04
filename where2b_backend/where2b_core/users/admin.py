from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _
from django import forms
from django.contrib.auth.forms import UserChangeForm, ReadOnlyPasswordHashField
import unicodedata

from .models import CustomUser, RestaurantProfile, UserProfile

class UsernameField(forms.CharField):
   def to_python(self, value):
      if value:
         return unicodedata.normalize('NFKC', super().to_python(value))

class ArticleForm(forms.ModelForm):
   
   password = ReadOnlyPasswordHashField(
        label=_("Password"),
        help_text=_(
            'Raw passwords are not stored, so there is no way to see this '
            'user’s password, but you can change the password using '
            '<a href="../password/">this form</a>.'
        ),
    )


   class Meta:
      model = CustomUser
      fields = '__all__'



class CustomUserAdmin(UserAdmin):
   # fields = ('email', 'username', 'password', )
   # username = UsernameField()
   form = ArticleForm

   fieldsets = (
        (_('Credentials'), {'fields': ('email', 'username', 'password')}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                )
            },
        ),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

   ordering = ('id',)
   add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('email', 'password1', 'password2')}),
    )
   
   # model = CustomUser

   def clean_username(self):
      print("CLEANING")
        # do something that validates your data
      return self.cleaned_data["name"]

   def save_model(self, request, obj, form, change):
      print("SAVING MODELLLLLLLLLLLLLLLLLLL")
      print(obj.username)
      super().save_model(request, obj, form, change)


class RestaurantProfileAdmin(admin.ModelAdmin):
   model = RestaurantProfile


class UserProfileAdmin(admin.ModelAdmin):
   model = UserProfile


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(RestaurantProfile, RestaurantProfileAdmin)
admin.site.register(UserProfile, UserProfileAdmin)

