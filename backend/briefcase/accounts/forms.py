from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

#validators
def isValidUsername(value):
    try:
        User.objects.get(username = value)
    except User.DoesNotExist:
        return
    raise validators.ValidationError('The username "$s" is already taken.' % value)
        
class RegistrationForm(forms.Form):
        username = forms.CharField(max_length = 30, validators = [isValidUsername])
        email = forms.EmailField(max_length =30)
        password = forms.CharField(max_length = 30, widget=forms.PasswordInput)
        password_again = forms.CharField(max_length = 30, widget = forms.PasswordInput)
        
        def clean(self):
            cleaned_data = self.cleaned_data
            password = cleaned_data.get("password")
            password_again = cleaned_data.get("password_again")
            if password and password_again:
                if password!=password_again:
                    raise forms.ValidationError("passwords must match")
            return cleaned_data
 

