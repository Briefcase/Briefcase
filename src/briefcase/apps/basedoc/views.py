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
    print "Hit Home Request"
    return render(request, "basedoc/basedoc.html")

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


# the new function is called whenever the user requests to create a new document of the given type
@login_required
def new(request):
    newDocument = Basedoc(owner=request.user, file_name="New Basedoc", module="briefcase.apps.basedoc.views.home") # initlize the document
    newDocument.data = "{}" # initilized the data to an empty document
    newDocument.save() # save the data to the database
    url = {"url":reverse('briefcase.apps.basedoc.views.home', args=[newDocument.pk])} # Send the user back the url of the newly created document
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
    
 


    


