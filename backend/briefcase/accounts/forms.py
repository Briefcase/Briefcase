from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

#validators
def isValidUsername(value):
    try:
        User.objects.get(username = value)
    except User.DoesNotExist:
        return
    raise forms.ValidationError('The username is already taken')
        
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
                        msg = u"passwords must match"
                        self._errors["password_again"] = self.error_class([msg])
                        del cleaned_data["password"]
                        del cleaned_data["password_again"]
                        #raise forms.ValidationError("passwords must match")
            return cleaned_data
 

