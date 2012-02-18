##frontend.views
########

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.core.files import File

from serverSide.accounts.forms import RegistrationForm, SaveFileForm
from serverSide.accounts.models import UserProfile, Spreadsheet

import os

#function that will take an hmtl page and make the form on that page the login form
# def loginfunction(request, htmlpage):
    # form = AuthenticationForm()
    # if request.method == 'POST':
        # form = AuthenticationForm(request.POST)
        # un =request.POST['username']
        # pw = request.POST['password']
        # user = authenticate(username =un, password = pw)
        # if user is not None:
            # if user.is_active:
                # login(request, user)
                # return HttpResponseRedirect('spreadsheet')
            # else:
                # logout(request)
                # return HttpResponse("inactive - fail")
        # else:
            # logout(request)
            # return HttpResponse("fail")
    # return render_to_response(htmlpage, {'form':form},context_instance= RequestContext(request))
        
def index(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/accounts')
    else:
        logout(request)
    
    form=AuthenticationForm()
    if request.method=='POST':
        form=AuthenticationForm(request.POST)
        un=request.POST['username']
        pw=request.POST['password']
        user=authenticate(username=un, password=pw)
        if user is not None:
            if user.is_active:
                login(request,user)
                #return render_to_response('spreadsheet/spreadsheet.html', context_instance=RequestContext(request))
                return HttpResponseRedirect('/accounts')
            else:
                logout(request)
                return render_to_response('welcome.html', {'form':form}, context_instance=RequestContext(request))
        else:
            logout(request)
            return render_to_response('welcome.html',{'form':form},context_instance=RequestContext(request))
    #return loginfunction(request,'welcome.html')
    return render_to_response('welcome.html',{'form':form},context_instance=RequestContext(request))
    
def spreadsheet(request):
    if not request.user.is_authenticated():
        return render_to_response('login.html',{'form':AuthenticationForm()}, context_instance=RequestContext(request))
    return render_to_response('spreadsheet/spreadsheet.html', context_instance=RequestContext(request))
    
