from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from briefcase.core.spreadsheet.models import Spreadsheet

@login_required
def home(request, id):

    return render(request, "spreadsheet/spreadsheet.html")
