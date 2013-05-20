from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
from django_socketio import events

print "Loaded events.py for spreadsheet"

@events.on_message(channel="^spreadsheet-")
def message(request, socket, context, message):
    print "got message!"
    socket.send_and_broadcast_channel({'message':'hello world'})
    #socket.send({"action": "started", "users": users})
    #socket.send_and_broadcast_channel(message)


@events.on_finish(channel="^spreadsheet-")
def finish(request, socket, context):
    print "got finish!"



#on_connect(request, socket, context) - occurs once when the WebSocket connection is first established.
#on_message(request, socket, context, message) - occurs every time data is sent to the WebSocket. Takes an extra message argument which contains the data sent.
#on_subscribe(request, socket, context, channel) - occurs when a channel is subscribed to. Takes an extra channel argument which contains the channel subscribed to.
#on_unsubscribe(request, socket, context, channel) - occurs when a channel is unsubscribed from. Takes an extra channel argument which contains the channel unsubscribed from.
#on_error(request, socket, context, exception) - occurs when an error is raised. Takes an extra exception argument which contains the exception for the error.
#on_disconnect(request, socket, context) - occurs once when the WebSocket disconnects.
#on_finish(request, socket, context)