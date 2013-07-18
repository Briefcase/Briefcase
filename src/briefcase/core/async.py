import multiprocessing
import socket
import threading
import time
import hashlib
import base64
import struct

from django.contrib.sessions.models import Session
from django.contrib.auth.models import User

##################################### ASYNC ####################################
# The async program is ment to introduce a socketio like interface for         #
# briefcase, however becuase I can write the specific functions for the        #
# program I have decided to write some cool modules for live programming.      #
# Lets do some cool stuff with this. I hope it all gets documented well and I  #
# will change this opening message                                             #
################################################################################


class Sockets(object):

    _openSocket = None
    _socketPort = 8080
    callingFunctions = {}
    _threads = {}

    # Create the socket for people to connect to!
    def __init__(self,):
        pass

    def begin(self):
        print "Beginning socket"
        coreSocket = multiprocessing.Process(target=self.connectionSocket)
        coreSocket.start()

    # This function runs in a seperate multiprocess process waiting for new websocket connections
    def connectionSocket(self):
        # this is the function that handles all of the incoming socket data!?
        print "creating socket"
        # create the socket
        sock = socket.socket()
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('localhost', self._socketPort))  # connect to localhost on port 9876

        print "socket bound to port", self._socketPort

        sock.listen(1)


        # Loop through a bunch of different stuff
        while 1:
            t, _ = sock.accept()
            print "Got Connectino: Handling"
            self.handle(t)
            #threading.Thread(target=handle, args=(t,)).start()



    
    def sendWebsocketData(socket, frameType):
        # frameTypes
        # %x0 denotes a continuation frame
        # %x1 denotes a text frame
        # %x2 denotes a binary frame
        # %x3-7 are reserved for further non-control frames
        # %x8 denotes a connection close
        # %x9 denotes a ping
        # %xA denotes a pong
        # %xB-F are reserved for further control frames
        pass






    # this is a function that runs a set of processes
    def documentProcess (self, inputQueue, outputQueue): # maybe no inital socket
        socketList = [] # this is the list of sockets that are connected on this thread

        class ThreadedSock():
            me_socket = None
            def sendToAll(self, data):
                for client_socket in socketList:
                    sendWebsocketText(client_socket, data)

            def sendToMe(self, data):
                sendWebsocketText(me_socket, data)

            def sendToAllButMe(self, data):
                for client_socket in socketList:
                    if client_socket != me_socket:
                        sendWebsocketText(client_socket, data)
            def disconnect(self, data):
                pass
            # im going a little insane wrapping my brain around all of this so far

        while 1: # loop until break
            break














    def handle(self,sock):
        print '--- Got message! ---'

        data = sock.recv(4096)

        lines = data.split('\r\n')

        metadata = {}

        requestType = ""  # get push etc.
        requestLocation = ""  # url it is accessing
        requestProtocol = ""  # HTTP/1.1

        requestLine = lines[0].split(' ')
        requestType = requestLine[0]
        requestLocation = requestLine[1]
        requestProtocol = requestLine[2]

        print requestLocation

        splitLocatoin = requestLocation.split('/')
        requestApplication = splitLocatoin[1]
        requestDocumentId = splitLocatoin[2]

        print "Requested Application:", requestApplication
        print "Requested Document ID:",requestDocumentId

        # get all the other data given in the header
        for line in lines:
            tokens= line.split(':')
            if len(tokens) < 2:
                continue
            name = tokens[0]
            value = tokens[1]

            metadata[name] = value
            print ("("+name+")").ljust(27), value
        
        # call function
        
        # get the user trying to subscribe to the spreadsheet
        print metadata
        sessionid = metadata['Cookie'].split(';')[1].strip()[10:]
        print "SESSION ID! (HACKSQ!)", sessionid
        session = Session.objects.get(session_key=sessionid)
        uid = session.get_decoded().get('_auth_user_id')
        user = User.objects.get(pk=uid)


        request = {'user':user, 'id':requestDocumentId}

        # class ThreadedSock():
        #     me_socket = None
        #     def __init__(self, me_socket):
        #         self.me_socket = me_socket
        #     def sendToAll(self, data): # cheating: no other sockets exist so only send to you HACKS
        #         sendWebsocketText(self.me_socket, data)
        #     def sendToMe(self, data):
        #         sendWebsocketText(self.me_socket, data)
        #     def sendToAllButMe(self, data): # cheating: no other sockets exist so only send to NOBBODY HACKS
        #         pass
        #     def disconnect(self, data):
        #         me_socket.close()


        # tsocket = ThreadedSock(sock)

        print '\n\n\n\n'
        print self.callingFunctions
        allowSocket = self.callingFunctions[requestApplication][0](request)

        websocketHeader = ""

        if allowSocket is False:
            websocketHeader = "HTTP/1.1 401 Unauthorized"
            sock.send(websocketHeader + "\r\n\r\n")
            sock.close()
            return

        # if the socket was allowed continue
        print "socket allow check run"

        baseKey = metadata['Sec-WebSocket-Key'].strip()
        #baseKey = "dGhlIHNhbXBsZSBub25jZQ=="
        print "Key:".ljust(15), baseKey
        concatinatedKey = baseKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        print "Concat Key:".ljust(15), concatinatedKey
        hashedKey = hashlib.sha1(concatinatedKey).digest()
        print "Hashed Key:".ljust(15), hashedKey
        base64Key = base64.b64encode(hashedKey)
        print "Final Key:".ljust(15), base64Key

        websocketHeader = "HTTP/1.1 101 Switching Protocols\r\n"
        websocketHeader += "Upgrade: websocket\r\n"
        websocketHeader += "Connection: Upgrade\r\n"
        websocketHeader += "Sec-WebSocket-Accept: "+ base64Key
        sock.send(websocketHeader + "\r\n\r\n")

        # now add the socket to the process it is supposed to go to

        # first check to see if the threadprocess exists for that file
        if requestDocumentId not in _threads:
            q = new queue
            p = #new process        

        _threads[requestDocumentId][1].put




    ############################ REGISTER FUNCTIONS ############################
    # The register functions function takes in a set of three functions as     #
    # well as a name. The name is the url of the current application while     #
    # the three functions are the onconnect, onmessage, and ondisconnect       #
    # functions that will be triggered when a socket of that application type  #
    # does any of the above actions                                            #
    # @CalledIn: Main Thread                                                   #
    # Data is passed from the main thread where this is called to the socket   #
    # thread where the socket is run                                           #
    # It may be easier if I can get the socket to not be initilized until the  #
    # second thread is created..                                               #
    ############################################################################
    def register(self, name, onconnect, onmessage, ondisconnect):
        # onconnect is blocking on websocket thread
        # onmessage and ondisconnect is blocking on the document's thread
        self.callingFunctions[name] = (onconnect, onmessage, ondisconnect)
        print "-- REGESTERING THE FUNCTIONS_______________________ Set up ", name
        print self.callingFunctions
        # this function could use some sanitization too...


# sending data from the server requires no masking bit
# text data is assumed all other methods will be ignored from this function
# current method only uses 7 and 16 bit lengths (no 64bit lengths yet)
# base framing protocal can be found on page 27 of RFC6455 websocket protocol
def sendWebsocketText(sock, text):
    maskAndLengthByte = ''
    extendedPayloadLength = ''
    length = len(text)
    if length <= 125:
        print "short length"
        maskAndLengthByte += struct.pack('>I', length)[3]
        print maskAndLengthByte
    else:
        print "long length"
        maskAndLengthByte = struct.pack('>I', 126)[3]
        print maskAndLengthByte
        extendedPayloadLength = struct.pack('>I', length)[2:4]
        print extendedPayloadLength

    finRsvAndOpcode = '\x81'  # fin (x8_)(B1000000) and no RSV opcode is x_1 for text

    message = finRsvAndOpcode + maskAndLengthByte + extendedPayloadLength + text

    sock.send(message)


print " -- running server from", __name__
sockets = Sockets()



# how will this work, how does a websocket thread get made?

# one thread per document but how do you determine the document type? does that get passed into the thread
# and also how do you get which thread to send the new socket to?
# there needs to be a way to parse the "documentid"
# maybe there is in the "origin tag"
# lets try printing out basic connect messages with instant disconnects