from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from django.contrib.auth.models import User
from django.contrib.auth import logout

from briefcase.core.accounts.forms import *
from briefcase.core import module

@login_required
def home(request):
    types = module.getTypes()
    user_document_list = sorted(list(request.user.allowed_docs.all()) + list(request.user.owner.all()), key=lambda doc: doc.modified_date, reverse=True)

    user_view_list = request.user.view_only_docs.all()
    return render(request, "accounts/user_profile.html", {'current_user': request.user, 'user_document_list': user_document_list, 'user_view_list': user_view_list, "types":types})

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
            user.save()

            #send email - need to set up the email stuff still
            # send_mail('Registration Successful', 'You\'re registration with briefcasedocs.com was successful.', 'from@example.com',[email],fail_silently=False)

            return HttpResponse("Registration successful")

    return render(request,'accounts/register.html', {'form':form})

def logout_user(request):
    logout(request)
    return redirect('briefcase.core.accounts.views.home')




