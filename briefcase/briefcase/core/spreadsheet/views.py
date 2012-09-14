from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from briefcase.core.spreadsheet.models import Spreadsheet
import json

@login_required
def home(request, id):
    return render(request, "spreadsheet/spreadsheet.html")

def load(request, id):
    data = Spreadsheet.objects.get(pk=id)
    return HttpRequest(data)
