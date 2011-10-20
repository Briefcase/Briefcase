from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.core.mail import send_mail
from briefcase.accounts.forms import RegistrationForm
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.core.files import File


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
            
            f=open('/home/shared/briefcase/backend/briefcase/accounts/test.txt','w')
            #myfile=File(f)
            #myfile.write('hey there everyone')
            f.write(username + '\n')
            f.write(email + '\n')
            #myfile.close()
            f.close()
  
            #print(username)
            #print(email)
            
            #do some other stuff here with the data
            user = User.objects.create_user(username, email, password)
            user.is_active = False
            user.save()
            #form = RegistrationForm()
            return HttpResponse("Registration successful")
                
        else:
            form = RegistrationForm(request.POST)
    
    return render_to_response('accounts/register.html', {'form':form}, context_instance =  RequestContext(request))
    
def userlogin(request):
    form = AuthenticationForm()
    if request.method == 'POST':
        form = AuthenticationForm(request.POST)
        un =request.POST['username']
        pw = request.POST['password']
        user = authenticate(username =un, password = pw)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('../')
            else:
                logout(request)
                return HttpResponse("inactive - fail")
        else:
            logout(request)
            return HttpResponse("fail")
    return render_to_response('accounts/login.html', {'form':form}, context_instance = RequestContext(request))

def userlogout(request):
    logout(request)
    return HttpResponseRedirect('login.html')