#spreadsheet.views
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpRequest, Http404, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from models import Spreadsheet
import json
from SpreadsheetSession import SpreadsheetSession, ClientList


#list of spreadsheetsessions
spreadsheetsessions = {}

@login_required
def home(request, id):
    #from briefcase import core
    #core.sockets.testFunction()
    #print [method for method in dir(core) ]#if callable(getattr(core.sockets, method))]
    print "tested function"
    return render(request, "spreadsheet/spreadsheet.html",{'file_name':Spreadsheet.objects.get(pk=id).file_name,'session_key':request.session.session_key})

@login_required
def load(request):
    #
    # need to add check for allowed users
    #
    id = request.POST.get('id')
    if not id:
        raise Http404()
    data = Spreadsheet.objects.get(pk=id).data
    return HttpResponse(data)

@login_required
def new(request):
    ss = Spreadsheet(owner=request.user, file_name="New Spreadsheet", module="briefcase.apps.spreadsheet.views.home")
    ss.data = "{}"
    ss.save()
    url = {"url":reverse('briefcase.apps.spreadsheet.views.home', args=[ss.pk])}
    return HttpResponse(json.dumps(url))
   
#"development" save - saves the whole document   
@login_required
def devsave(request):
    id=request.POST['id'] #pk of spreadsheet
    data=request.POST['spreadsheetcells'] #get data
    s=Spreadsheet.objects.get(pk=id)
    #check to see if allowed to save
    if not request.user==s.owner and request.user not in s.allowed_users and s.public==False:
       return HttpResponse("error")
    s.data=data
    s.save()
    return HttpResponse("success")
    
def autosave(request):
    id=request.POST['id'] #pk of spreadsheet
    #check to see if new spreadsheet
    # (SpreadsheetSession will handle checking if new client)
    if not id in spreadsheetsessions:
        spreadsheetsessions[id]= SpreadsheetSession(id)
    data = request.POST['spreadsheetcells']
    user = request.user.username
    #receive
    #print spreadsheetsessions[id].receive(data,request.user)
    return HttpResponse(spreadsheetsessions[id].receive(data,user))
    
 

def socketTest(request):
    print request
    print HttpResponse("Hello")
    djangoHacker = None
    djangoHacker.status_code = "201"
    djangoHacker.socket_handler = "some function here"
    return djangoHacker
    


