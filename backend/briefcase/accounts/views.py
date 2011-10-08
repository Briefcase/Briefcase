from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.core.mail import send_mail
from briefcase.accounts.forms import RegistrationForm
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext


def index(request):
    return HttpResponse("Hi there. Would you like a cookie? - Account stuff here")

def register(request):
    form = RegistrationForm()
    if request.method == 'POST':   
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            email =  form.cleaned_data['email']
            password = form.cleaned_data['password_again']
            
            #do some other stuff here with the data
            user = User.objects.create_user(username, email, password)
            user.is_active = False
            user.save()
            form = RegistrationForm()
                
        else:
            form = RegistrationForm(request.POST)
    return render_to_response('accounts/register.html', {'form':form}, context_instance =  RequestContext(request))