#spreadsheet.views
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpRequest, Http404, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from models import Basedoc
import json
from session import Session, ClientList


#list of spreadsheetsessions
spreadsheetsessions = {}

@login_required
def home(request, id):
    return render(request, "basedoc/spreadsheet.html")

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
    print "Made it to new [Mark1]"
    newDocument = Basedoc(owner=request.user, file_name="New Basedoc", module="briefcase.apps.basedoc.views.home")
    print "Created the variable [Mark2]"
    newDocument.data = "{}"
    print "Initilized the new data [Mark3]"
    newDocument.save()
    print "Saved the document [Mark4]"
    url = {"url":reverse('briefcase.apps.basedoc.views.home', args=[newDocument.pk])}
    print "Fnished the function [Mark5]"
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
    
 


    


