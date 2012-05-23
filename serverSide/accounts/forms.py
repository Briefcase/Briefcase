from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm

#validators
def isValidUsername(value):
    try:
        User.objects.get(username = value)
    except User.DoesNotExist:
        return
    raise forms.ValidationError('The username is already taken')

def isValidKey(value):
    if value!= '62657468':
        raise forms.ValidationError('Incorrect Key')
        
class RegistrationForm(forms.Form):
        username = forms.CharField(max_length = 30, validators = [isValidUsername])
        email = forms.EmailField(max_length =30)
        password = forms.CharField(max_length = 30, widget=forms.PasswordInput)
        password_again = forms.CharField(max_length = 30, widget = forms.PasswordInput)
        key = forms.CharField(max_length = 100, validators = [isValidKey],widget=forms.PasswordInput)
        
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
            return cleaned_data
 
 
 
class SaveFileForm(forms.Form):
    file=forms.FileField()
    
        
    
    
    


