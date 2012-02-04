from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.core.files import File

from briefcase.accounts.forms import RegistrationForm, SaveFileForm
from briefcase.accounts.models import UserProfile

import os,cStringIO


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
            
            #create user and save
            user = User.objects.create_user(username, email, password)
            user.is_active = False
            user.save()
            #put user in a UserProfile
            profile = UserProfile(name = username,user =user, randomfield='hi')
            profile.save()
            
            #create file storage folder
            filename = 'accounts/userfiles/' + username + '/imaginaryfile.txt'
            dir = os.path.dirname(filename)
            if not os.path.exists(dir):
                os.makedirs(dir)
            
            #send email - need to set up the email stuff still
            # send_mail('Registration Successful', 'You\'re registration with briefcasedocs.com was successful.', 'from@example.com',[email],fail_silently=False)
            
            #form = RegistrationForm()
            return HttpResponse("Registration successful")
                
        else:
            form = RegistrationForm(request.POST)
    
    return render_to_response('register.html', {'form':form}, context_instance =  RequestContext(request))
    
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
    return render_to_response('login.html', {'form':form}, context_instance = RequestContext(request))

def userlogout(request):
    logout(request)
    return HttpResponseRedirect('login.html')
    
def save(request):
    if request.is_ajax():
        data=request.read()
        destination = open('accounts/userfiles/' + request.user.username + '/test.txt', 'wb+')
        destination.write(data)
        destination.close()
        return HttpResponse("saved")
    else return HttpResponse("failed")
    
def load(request):
    if request.is_ajax():
        file=open('accounts/userfiles/' + request.user.username + '/test.txt')
        return HttpResponse(file.read())
    else return HttpResponse("failed")
        
        
def save_file(request):
    if request.method =='POST':
        form = SaveFileForm(request.POST, request.FILES)
        if form.is_valid():
            #handle the file
            f=request.FILES['file']
            destination = open('accounts/userfiles/' + request.user.username + '/test.txt','wb+')
            for chunk in f.chunks():
                destination.write(chunk)
            destination.close()
            return HttpResponse("success")
    else:
        form=SaveFileForm()
    return render_to_response('uploadfile.html',{'form':form}, context_instance = RequestContext(request))
    
    
#def load_file(request):
    
    
        