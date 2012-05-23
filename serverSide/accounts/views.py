##
#accounts.views
###
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
from serverSide.accounts.models import UserProfile
from serverSide.spreadsheet.models import Spreadsheet


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
                return redirect("/accounts")
            else:
                logout(request)
                return render_to_response('welcome.html', {'form':form}, context_instance=RequestContext(request))
        else:
            logout(request)
            return render_to_response('welcome.html',{'form':form},context_instance=RequestContext(request, {'showerror': 1}))
    return render_to_response('welcome.html',{'form':form},context_instance=RequestContext(request))

def userprofile(request):
    profile = request.user.get_profile()
    user_spreadsheet_list = UserProfile.objects.get(user=request.user).allowed_spreadsheets.all()
    user_view_list = UserProfile.objects.get(user=request.user).view_only_spreadsheets.all()
    t=loader.get_template('user_profile.html')
    c = RequestContext(request,{
        'user_spreadsheet_list': user_spreadsheet_list,
        'user_view_list': user_view_list,
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
            profile = UserProfile(user =user)
            profile.save()
            
            
            #send email - need to set up the email stuff still
            # send_mail('Registration Successful', 'You\'re registration with briefcasedocs.com was successful.', 'from@example.com',[email],fail_silently=False)
            
            return HttpResponse("Registration successful")
                
        else:
            form = RegistrationForm(request.POST)
    
    return render_to_response('register.html', {'form':form}, context_instance =  RequestContext(request))
    
def userlogout(request):
    logout(request)
    return HttpResponseRedirect('../')
    

    
    
    
        