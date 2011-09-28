from django.http import HttpResponse
from django.contrib.auth.models import User

def index(request):
    user = User.objects.create
    return HttpResponse("Hi there. Would you like a cookie? - New User Registration will hopefully go here")
