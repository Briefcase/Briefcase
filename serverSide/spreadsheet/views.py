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

import json

current = {} #this is a dictionary with spreadsheet ids as the keys
                #the values are a list
                # of a list of length 2
                #which has a profile object and a dictionary of changes

def autosave(request):
    print("in the function")
    if request.is_ajax():
        print("in the ajax")
        id = request.POST['fileid'] #get the id
        input = request.POST['filedata'] # get the data
        owner = request.POST['fileowner'] #get file owner
        print(owner)
        print("got the request data")
        cur_profile=UserProfile.objects.get(user=request.user)
        own_profile=UserProfile.objects.get(user=User.objects.get(username=owner))
        print("got the profiles")
        sp = Spreadsheet.objects.get(pk=id)
        print("got the spreadsheet")
        #if not allowed - forbidden
        # if (not cur_profile in sp.allowed_user.all()) and (s.public==False):
            # print("not allowed")
            # return HttpResponseForbidden()
            
        print("about to put the data in dict")
        cur_data = json.loads(sp.data)
        #parse new data
        changes = json.load(input)
        #make changes to cur_data
        print("about to add changes")
        for key in changes:
            cur_data[key]=changes[key] # will update old value or make new key,value
        #save the file
        sp.data = cur_data
        sp.save()
        print("saved")
        #put user down as saving
        #current[sp.file_name].append([cur_profile,changes])
        #return
        print(json.dumps(cur_data))
        return HttpResponse(json.dumps(cur_data))
    else:
        return HttpResponseBadRequest()
                
                
        
        
        
# def save(request):
    # if request.is_ajax():
        # fname=request.POST['filename'] #get the filename
        # input=request.POST['filedata'] #get the data
        # profile = request.user.get_profile() # gets the UserProfile related to request.user
        #check to see if it exists
        # try:
            # sp = Spreadsheet.objects.get(owner=profile, file_name=fname)
        # except Spreadsheet.DoesNotExist:
#       create new spreadsheet
            # s = Spreadsheet(owner=profile, file_name=fname, data=input, public=False)
            # s.save()
            # s.allowed_users.add(profile)
            # s.save()
            # return HttpResponse()
       #file exists, overwrite the data
        # sp=Spreadsheet.objects.get(owner=profile, file_name=fname)
        # sp.data = input
        # sp.save()
    # return HttpResponse()

    
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
      
def spreadsheet(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html',{'form':AuthenticationForm()}, context_instance=RequestContext(request))
    #create new spreadsheet
    # profile = request.user.get_profile()
    # s=Spreadsheet(owner=profile, file_name='Untitled', data='', public=False)
    # s.allowed_users.add(profile)
    # s.save()
    # add an entry in current
    # current['Untitled']=[[profile,{}]
    return render_to_response('spreadsheet.html', context_instance=RequestContext(request))
