from django.shortcuts import render_to_response
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect


def index(request):
    if not request.user.is_authenticated():
        return HttpResponse("nop")
    print(request.user.username)
    return render_to_response('begin.html')
    
