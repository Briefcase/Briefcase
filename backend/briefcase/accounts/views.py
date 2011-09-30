from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.core.mail import send_mail
from briefcase.accounts.forms import RegistrationForm
#from django.contrib.auth.forms import UserCreationForm

def index(request):
    return HttpResponse("Hi there. Would you like a cookie? - Account stuff here")

def register(request):
    # if request.user.is_authenticated():
        # return render_to_response('register.html', {'has_account': True})
    if request.method == 'POST':   
        form = RegistrationForm(request.POST)
        #form = UserCreationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            email =  form.cleaned_data['email']
            password = form.cleaned_data['pw2']
            
            #do some other stuff here with the data
            
            #return HttpResponse('thanks') #redirect to thanks page after POST
    else:
            form = RegistrationForm()
            #form = UserCreationForm()
    return render_to_response('accounts/register.html', {'form':form})