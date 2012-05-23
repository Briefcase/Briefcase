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
from django.core.exceptions import ObjectDoesNotExist

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
    print id
    bval_temp = request.POST['publicbool'] #new val for public bool
    bval=False
    if bval_temp=="True":
        bval=True
    print bval
    new_view_only = json.loads(request.POST['newviewlist']) #new view only users
    print new_view_only
    delete_view_only = json.loads(request.POST['deleteviewlist']) #view only users to be removed
    print delete_view_only
    new_allowed= json.loads(request.POST['newallowedlist']) #new allowed users
    print new_allowed
    delete_allowed = json.loads(request.POST['deleteallowedlist']) #allowed users to be removed
    print delete_allowed
    s= Spreadsheet.objects.get(pk=id) #fetch existing spreadsheet obj
    print s
    profile = request.user.get_profile() # get current user
    print profile
    if s.owner==profile: #if user is owner - allow changes
        s.public=bval
        print s.public
        # handle allowed users
        # add new users
        for username in new_allowed:
            print username
            try:
                u = UserProfile.objects.get(user=User.objects.get(username=username))
                s.allowed_users.add(u)
            except ObjectDoesNotExist:
                print "user does not exist"
        s.save()
        # delete users
        for deletename in delete_allowed:
            print deletename
            try:
                u=UserProfile.objects.get(user = User.objects.get(username=deletename))
                if u in allowed_users.all():
                    s.allowed_users.remove(u)
            except ObjectDoesNotExist:
                print "user does not exist"
        s.save()
                
        for username in new_view_only:
            print username
            try:
                u = UserProfile.objects.get(user=User.objects.get(username=username))
                s.view_only_users.add(u)
            except ObjectDoesNotExist:
                print "user does not exist"
        s.save()
        # delete users
        for deletename in delete_view_only:
            print deletename
            try:
                u=UserProfile.objects.get(user = User.objects.get(username=deletename))
                if u in view_only_users.all():
                    s.view_only_users.remove(u)
            except ObjectDoesNotExist:
                print "user does not exist"
        s.save()
        return HttpResponse("complete")
    return HttpResponse("error")

def returnsettings(request):
    id=request.POST['fileid'] #pk of spreadsheet
    print(id)
    s=Spreadsheet.objects.get(pk=id) #fetch spreadsheet
    print(s)
    publicbool = s.public
    viewlist=[]
    for i in s.view_only_users.all():
        viewlist.append(i.user.username)
    print viewlist
    allowedlist=[]
    for j in s.allowed_users.all():
        allowedlist.append(j.user.username)
    print allowedlist
    msg = json.dumps({"publicbool":publicbool, "viewlist":viewlist, "allowedlist":allowedlist})
    print msg
    return HttpResponse(msg, content_type = "application/json")
        

#loads the spreadsheet page      
def spreadsheet(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html',{'form':AuthenticationForm()}, context_instance=RequestContext(request))
    return render_to_response('spreadsheet.html', context_instance=RequestContext(request))