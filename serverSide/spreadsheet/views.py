####
# spreadsheet.views
######


from serverSide.accounts.models import UserProfile
from serverSide.spreadsheet.models import Spreadsheet
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext, Context, loader
from django.contrib.auth.forms import AuthenticationForm
from django.utils.encoding import smart_str

import json

current = {} #this is a dictionary with spreadsheet ids as the keys
                #the values are a list
                # of a list of length 2
                #which has a profile object and a dictionary of changes

def autosave(request):
    if request.is_ajax():
        id = request.POST['fileid'] #get the id
        input = request.POST['filedata'] # get the data
        owner = request.POST['fileowner'] #get file owner
        cur_profile=UserProfile.objects.get(user=request.user)
        own_profile=UserProfile.objects.get(user=User.objects.get(username=owner))
        sp = Spreadsheet.objects.get(pk=id)
        #if not allowed - forbidden
        if cur_profile not in sp.allowed_users.all() and sp.public==False:
            print("not allowed")
            return HttpResponseForbidden()
            
        cur_data = json.loads(sp.data)
        #parse new data
        changes = json.loads(input)
        #make changes to cur_data
        for key in changes:
            cur_data[key]=changes[key] # will update old value or make new key,value
        #save the file
        sp.data = json.dumps(cur_data)
        sp.save()
        #put user down as saving
        #current[sp.file_name].append([cur_profile,changes])
        #return
        return HttpResponse(sp.data)
    else:
        return HttpResponseBadRequest()

        

#load function use for loading spreadsheets from the user profile page        
def load(request):
    if request.is_ajax():
        id=request.POST['fileid']#get the id of requested file
        uname=request.POST['fileowner'] #get the user that owns the file
        cur_profile=UserProfile.objects.get(user=request.user)
        own_profile=UserProfile.objects.get(user=User.objects.get(username=uname))
        s=Spreadsheet.objects.get(pk=id)
        if s.public==True or cur_profile in s.allowed_users.all():
            #current[s.file_name] = [[cur_profile,{}]]
            return HttpResponse(s.data) #send to frontend the entire file
        else:
            return HttpResponseForbidden()
        return HttpResponse(s.data)
    else:
        return HttpResponseBadRequest()

#loads and saves a blank spreadsheet file with the name Untitled        
def new(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html', {'form': AuthenticationForm()}, context_instance=RequestContext(request))
    #create new blank spreadsheet and save it
    profile = request.user.get_profile()
    s=Spreadsheet(owner=profile, file_name='Untitled', data='{}', public=False)
    s.save() #need to save here so new spreadsheet generates a pk
    s.allowed_users.add(profile)
    s.save()
    #add an entry in current
    #current['Untitled']=[[profile,{}]
    return redirect('/spreadsheet?' + smart_str(s.owner)+ '&' + smart_str(s.pk))

#deletes the spreadsheet - user must be owner    
def delete(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html', {'form': AuthenticationForm()}, context_instance=RequestContext(request))
    #delete the spreadsheet
    id=request.POST['fileid'] #pk of spreadsheet
    profile = request.user.get_profile()#get current user
    s=Spreadsheet.objects.get(pk=id)#get existing spreadsheet
    if s.owner==profile: #if user is owner - allow delete
        s.delete() #delete
        return HttpResponse("deleted")
    return HttpResponse("error")

#rename the spreadsheet - user must be owner
def rename(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html', {'form': AuthenticationForm()}, context_instance=RequestContext(request))
    #rename the spreadsheet
    id=request.POST['fileid'] #pk of spreadsheet
    newname=request.POST['newname'] #new name for spreadsheet
    s=Spreadsheet.objects.get(pk=id) #fetch existing spreadsheet obj
    profile = request.user.get_profile() #get current user
    if s.owner==profile: #if user is owner - allow rename
        #rename and save
        s.file_name=newname
        s.save()
        return HttpResponse("name is" + s.file_name)
    return HttpResponse("error")

#change the spreadsheet settings - public bool, view list, allowed users list
def changesettings(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html', {'form': AuthenticationForm()}, context_instance=RequestContext(request))
    id = request.POST['fileid'] #pk of spreadsheet
    bval = request.POST['publicbool'] #new val for public bool
    view_only = request.POST['viewlist'] #new val for view only users
    allowed = request.POST['allowedlist'] #new val for allowed users
    s= Spreadsheet.objects.get(pk=id) #fetch existing spreadsheet obj
    profile = request.user.get_profile() # get current user
    if s.owner==profile: #if user is owner - allow changes
        s.public=bval
        s.view_only_users = view_only
        s.allowed_users=allowed
        s.save()
        return HttpResponse("public: " + bval + " view only: " + view_only + " allowed: " + allowed)
    return HttpResponse("error")

def returnsettings(request):
    id=request.POST['fileid'] #pk of spreadsheet
    s=Spreadsheet.objects.get(pk=id) #fetch spreadsheet
    publicbool = s.public
    viewlist = s.view_only_users
    allowedlist=allowed_users
    return HttpResponse(json.dumps({
            "publicbool": publicbool,
            "viewlist": viewlist,
            "allowedlist": allowedlist}),
        content_type="application/json")
        

#loads the spreadsheet page      
def spreadsheet(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html',{'form':AuthenticationForm()}, context_instance=RequestContext(request))
    return render_to_response('spreadsheet.html', context_instance=RequestContext(request))