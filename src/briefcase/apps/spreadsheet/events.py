from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
from django_socketio import events
from django.contrib.auth.decorators import login_required
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User

import random
import string

print "Loaded events.py for spreadsheet"

openSpreadsheets = {}

# @events.on_connect()
# def connect (request, socket, context):
# 	print "GOT CONNECTION!"
# 	print request


@events.on_message(channel="spreadsheet")
def message(request, socket, context, message):
    print "Got Message! (Spreadsheet)"
    if message['action'] == "connect":
    	print "New connection:"
    	print message["id"]
    	print message["sessionid"]
    	session = Session.objects.get(session_key=message['sessionid'])
    	uid = session.get_decoded().get('_auth_user_id')
    	user = User.objects.get(pk=uid)
    	print user
    socket.broadcast_channel({'message':'hello world'}) # send to everyone but the sender
    socket.send({'message':'not hello world','ID':generateToken(size=64)}) # send to the sender


# @login_required
# @events.on_subscribe(channel="spreadsheet")
# def subscribe(request, socket, context, channel):
# 	# - occurs when a channel is subscribed to. Takes an extra channel argument which contains the channel subscribed to.
# 	print "Client Subscribed! (spreadsheet)"
# 	#print "REQUEST: ",request
# 	#print "SOCKET: ",socket
# 	context["chanel"] = channel
# 	#print "CONTEXT: ",context
# 	#print "CHANEL: ",channel

# @events.on_unsubscribe(channel="^spreadsheet-")
# def unsubscribe(request, socket, context, channel):
# 	# - occurs when a channel is unsubscribed from. Takes an extra channel argument which contains the channel unsubscribed from.
# 	print "Client Unsubscribed! (Spreadsheet)"
# 	#print request.user
# 	#print socket
# 	#print context
# 	#print channel

@events.on_finish(channel="spreadsheet")
def finish(request, socket, context):
    print "got finish! (Spreadsheet)"
    #print request.user
    #print context


def generateToken(size=6, chars=string.ascii_uppercase + string.ascii_lowercase + string.digits):
	return ''.join(random.choice(chars) for x in range(size))












# @events.on_connect() # cannot take in a chanel
# def connect(request, socket, context):
# 	# - occurs once when the WebSocket connection is first established.
# 	print "Socket Connected! (spreadsheet)"




# @events.on_error(channel="^spreadsheet-")
# def error(request, socket, context, exception):
# 	# - occurs when an error is raised. Takes an extra exception argument which contains the exception for the error.
# 	print "SOCKET ERROR! (Spreadsheet)"

# @events.on_disconnect(channel="^spreadsheet-")
# def disconnect(request, socket, context):
# 	# - occurs once when the WebSocket disconnects.
# 	print "Client Disconnect! (Spreadsheet)"
