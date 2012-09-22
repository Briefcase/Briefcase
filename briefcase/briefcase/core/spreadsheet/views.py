from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from briefcase.core.spreadsheet.models import Spreadsheet
import json

@login_required
def home(request, id):
    return render(request, "spreadsheet/spreadsheet.html")

@login_required
def load(request, id):
    data = Spreadsheet.objects.get(pk=id)
    return HttpRequest(data)

@login_required
def new(request):
    ss = Spreadsheet(owner=request.user, file_name="New Spreadsheet", module="briefcase.core.spreadsheet.views.home")
    ss.save()
    url = {"url":reverse('briefcase.core.spreadsheet.views.home', args=[ss.pk])}
    return HttpResponse(json.dumps(url))

