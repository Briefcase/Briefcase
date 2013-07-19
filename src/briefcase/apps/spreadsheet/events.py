def onMessage(request, message, socket):
    print "ON MESSAGE! :" + message
    socket.sendToMe("Hello Back!")
    pass

def onConnect(requestData):
    #socket.sendToAll("Test All")
    #socket.sendToAllButMe("Test Not Me")
    #socket.sendToMe("Test Me")
    return True
    
def onDisconnect():
    pass