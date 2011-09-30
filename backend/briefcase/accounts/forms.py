from django import forms
from django.core import validators
from django.contrib.auth.models import User


class RegistrationForm(forms.Form):
        username = forms.CharField(max_length = 30)
        email = forms.EmailField(max_length =30)
        password = forms.CharField(max_length = 30)
        password_again = forms.CharField(max_length = 30)
 
#need to look up how to do stuff with validators...kept getting errors 
    # def passwordMatches(self, value):
        # if value !=self.pw1:
            # raise validators.ValidationError('Passwords must match.')
    # def isValidUsername(self, value):
        # try:
            # User.objects.get(username = value)
        # except User.DoesNotExist:
            # return
        # raise validators.ValidationError('The username "$s" is already taken.' % value)