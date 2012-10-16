#core views
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpRequest, Http404
from django.contrib.auth.decorators import login_required
from briefcase.core.spreadsheet.models import Spreadsheet
import json

@login_required

def delete(request):
    id=request.POST.get('id')#pk of document
    s=Document.objects.get(pk=id);
    if s.owner==request.user: #if user is owner, allow delete
        s.delete()
        return HttpResponse("deleted");
    return HttpResponse("error");
    
@login_required  
def rename(request):
    id=request.POST.get('id') #pk of document
    s=Document.object.get(pk=id);
    newname = request.POST.get('newname')
    if s.owner == request.user: #if user is owner, allow rename
        s.file_name=newname
        s.save()
        return HttpResponse("name is " + s.file_name)
    return HttpResponse("error")