##
#accounts.views
##

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext, Context, loader
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.core.files import File

from serverSide.accounts.forms import RegistrationForm, SaveFileForm
from serverSide.accounts.models import UserProfile, Spreadsheet

import os, hashlib


def index(request):
    profile = request.user.get_profile()
    user_spreadsheet_list = Spreadsheet.objects.all().order_by('file_name')
    t=loader.get_template('user_profile.html')
    c = Context({
        'user_spreadsheet_list': user_spreadsheet_list,
        'current_user': request.user,
    })
    return HttpResponse(t.render(c))

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
            
            
            #send email - need to set up the email stuff still
            # send_mail('Registration Successful', 'You\'re registration with briefcasedocs.com was successful.', 'from@example.com',[email],fail_silently=False)
            
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
    return HttpResponseRedirect('../')
    
def save(request):
    if request.is_ajax():
        fname=request.POST['filename'] #get the filename
        input=request.POST['filedata'] #get the data
        profile = request.user.get_profile() # gets the UserProfile related to request.user
        #check to see if it exists
        try:
            sp = Spreadsheet.objects.get(owner=profile, file_name=fname)
        except Spreadsheet.DoesNotExist:
            #create new spreadsheet
            s = Spreadsheet(owner=profile, file_name=fname, data=input)
            s.save()
            return HttpResponse()
       #file exists, overwrite the data
        sp=Spreadsheet.objects.get(owner=profile, file_name=fname)
        sp.data = input
        sp.save()
    return HttpResponse()

    
def load(request):
    if request.is_ajax():
        fname=request.POST['filename'] #get the name of requested file
        profile=UserProfile.objects.get(user=request.user)
        s=Spreadsheet.objects.get(owner=profile, file_name=fname)
        return HttpResponse(s.data) #send to frontend the entire file
    else:
        return HttpResponse("failed")
        
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
    
    
        