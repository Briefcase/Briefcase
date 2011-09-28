from django.http import HttpResponse

def index(request):
    return HttpResponse("Hi there. Would you like a cookie? - New User Registration will hopefully go here")
