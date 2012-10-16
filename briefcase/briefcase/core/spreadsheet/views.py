#spreadsheet.views
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpRequest, Http404, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from briefcase.core.spreadsheet.models import Spreadsheet
import json

@login_required
def home(request, id):
    return render(request, "spreadsheet/spreadsheet.html")

@login_required
def load(request):

    # need to add check for allowed users
    
    id = request.POST.get('id')
    if not id:
        raise Http404()
    data = Spreadsheet.objects.get(pk=id).data
    return HttpResponse(data)

@login_required
def new(request):
    ss = Spreadsheet(owner=request.user, file_name="New Spreadsheet", module="briefcase.core.spreadsheet.views.home")
    ss.save()
    url = {"url":reverse('briefcase.core.spreadsheet.views.home', args=[ss.pk])}
    return HttpResponse(json.dumps(url))
    
@login_required
def dev_save(request):
    print "1"
    post = request.POST.copy()
    print "2"
    print post
    print post['spreadsheetcells[2,2]']
    id=request.POST['id'] #pk of spreadsheet
    print id
    #data=request.POST #get data
    #print request.POST
    #print data
    s=Spreadsheet.objects.get(pk=id)
    #check to see if allowed to save
    if request.user not in s.allowed_users.all() and s.public==False:
        return HttpResponseForbidden()
    print data
    s.data=data
    s.save()
    return HttpResponse()
    
    


    


