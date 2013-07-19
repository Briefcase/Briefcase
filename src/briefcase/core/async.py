import multiprocessing
import socket
import time
import hashlib
import base64
import struct
import select

from django.contrib.sessions.models import Session
from django.contrib.auth.models import User


##################################### ASYNC ####################################
# The async program is ment to introduce a socketio like interface for         #
# briefcase, however becuase I can write the specific functions for the        #
# program I have decided to write some cool modules for live programming.      #
# Lets do some cool stuff with this. I hope it all gets documented well and I  #
# will change this opening message                                             #
################################################################################


# the fake request object is a hack to emulate part of the actual django request object
# in the future this object may come to be able to fully handle any type of requets
# thet the regular request object can handle
class fakeRequest(object):
    path = ""  # the path that can be requested by the user
    user = None  # the user that created the websocket
    session = None  # to be implemented!
    extra = {}

    def __init__(self, path, session_key):
        # Initilize the session variable
        self.session = Session.objects.get(session_key=session_key)

        # Initilize the User variable from the session variable
        userid = self.session.get_decoded().get('_auth_user_id')
        self.user = User.objects.get(pk=userid)

        # initilize the path
        self.path = path


# This is the socket class, it handles the sockets and the data that is sent
# between them, as well as handling the calling of functions that are needed
class Sockets(object):

    _serverSocket = None  # the socket that is listeneing for new connections
    _socketPort = 8080  # the port that the listening socket is listening on
    callingFunctions = {}  # the map of registered document functions to call
    _documentSocketLists = {}  # the list of documents that are open
    #_socketToDocumentIdMap = {}  # maps the currently open sockets to their user ids
    #_socketToDocumentTypeMap = {}  # maps the currently open sockets to their document types
    _socketToRequestMap = {}

    # Create the socket for people to connect to!
    def __init__(self,):
        _communicationQueue = multiprocessing.Queue()
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
        self._serverSocket = socket.socket()
        self._serverSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._serverSocket.bind(('localhost', self._socketPort))  # connect to localhost on port 9876

        print "socket bound to port", self._socketPort

        self._serverSocket.listen(1)

        read_list = [self._serverSocket]
        # Loop through a bunch of different stuff
        while 1:
            readable, writeable, errored = select.select(read_list, [], [])  # wait for one of the sockets to do something
            for sock in readable:
                if sock == self._serverSocket:
                    t, _ = sock.accept()
                    print "Got Connectino: Handling"
                    if self.handle(t):
                        read_list.append(t)
                else:
                    print "Got a data connection:"
                    data = self.readWebsocketData(sock.recv(4096))
                    # call function for that socket

                    request = self._socketToRequestMap[sock]
                    documentId = request.extra['documentId']
                    documentType = request.extra['documentType']

                    socketList = self._documentSocketLists[documentId]

                    # a simple set of functioncalls to handle the application
                    class ThreadedSock():
                        def sendToAll(self, data):
                            for client_socket in socketList:
                                sendWebsocketText(client_socket, data)

                        def sendToMe(self, data):
                            sendWebsocketText(sock, data)

                        def sendToAllButMe(self, data):
                            for client_socket in socketList:
                                if client_socket != sock:
                                    sendWebsocketText(client_socket, data)
                        def disconnect(self, data):
                            pass

                    #request = {'user':user, 'id':requestDocumentId}
                    
                    # create a dummy socket object
                    socketObject = ThreadedSock()

                    self.callingFunctions[documentType][1](request, data, socketObject)


    def readWebsocketData(self, data):
        header = data[0]
        mask = struct.unpack(">B", data[1])[0] & 0x80           # B1000000
        print "Mask", mask
        payloadLength = struct.unpack(">B", data[1])[0] & 0x7F  # B0111111

        dataindex = 2

        # get correct payload length
        if payloadLength == 126:
            payloadLength = struct.unpack(">H", data[dataindex:dataindex+2])  # parse into a 2 byte unsigned short
            dataindex += 2

        elif payloadLength == 127:
            payloadLength = struct.unpack(">Q", data[dataindex:dataindex+8])  # parse into a 8 byte unsigned long long
            dataindex += 8

        # get the 32bit masking key
        maskingKey = [None]*4
        if mask != 0:
            maskingKey[0] = struct.unpack(">B", data[dataindex+0])[0]  # parse into four unsigned bytes
            maskingKey[1] = struct.unpack(">B", data[dataindex+1])[0]
            maskingKey[2] = struct.unpack(">B", data[dataindex+2])[0]
            maskingKey[3] = struct.unpack(">B", data[dataindex+3])[0]
            dataindex += 4
            print "masking Key", maskingKey

        payload = data[dataindex:dataindex+payloadLength]

        if maskingKey != "":
            transformedpayload = ""
            for (i, char) in enumerate(payload):
                j = i % 4
                transform = struct.unpack(">B", char)[0] ^ maskingKey[j]
                transformedpayload += struct.pack(">B", transform)
        payload = transformedpayload
        return payload






    # def sendWebsocketData(socket, frameType):
    #     # frameTypes
    #     # %x0 denotes a continuation frame
    #     # %x1 denotes a text frame
    #     # %x2 denotes a binary frame
    #     # %x3-7 are reserved for further non-control frames
    #     # %x8 denotes a connection close
    #     # %x9 denotes a ping
    #     # %xA denotes a pong
    #     # %xB-F are reserved for further control frames
    #     pass






    # # this is a function that runs a set of processes
    # def documentProcess (self, inputQueue, outputQueue): # maybe no inital socket
    #     socketList = [] # this is the list of sockets that are connected on this thread

    #     class ThreadedSock():
    #         me_socket = None
    #         def sendToAll(self, data):
    #             for client_socket in socketList:
    #                 sendWebsocketText(client_socket, data)

    #         def sendToMe(self, data):
    #             sendWebsocketText(me_socket, data)

    #         def sendToAllButMe(self, data):
    #             for client_socket in socketList:
    #                 if client_socket != me_socket:
    #                     sendWebsocketText(client_socket, data)
    #         def disconnect(self, data):
    #             pass
    #         # im going a little insane wrapping my brain around all of this so far

    #     while 1: # loop until break
    #         pass
    #         timeout = 1  # set timeout for 1 second maybe

    #         select.select(self.socketList, [], [], timeout)
    #         print "Got message"














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

        # parse the cookie data to get the session id
        cookies = self.parseCookie(metadata['Cookie'])
        print "cookies: ", cookies
        session_key = cookies['sessionid']

        # create a fake request object to pass to the socket handling function
        request = fakeRequest(requestLocation, session_key)
        request.extra = {'documentId': requestDocumentId, 'documentType': requestApplication}

        print '\n\n\n\n'
        print self.callingFunctions
        allowSocket = self.callingFunctions[requestApplication][0](request)

        # Check to see if the socket should be accepted or ignored
        if allowSocket is False:
            websocketHeader = "HTTP/1.1 401 Unauthorized"
            sock.send(websocketHeader + "\r\n\r\n")
            sock.close()
            # return the socket failed and should be ignored
            return False

        # Get the base websocket key and create the response key
        baseKey = metadata['Sec-WebSocket-Key'].strip()
        websocketResponseKey = createWebsocketResponseKey(baseKey)

        # respond with a sucess message to the websocket
        websocketHeader = "HTTP/1.1 101 Switching Protocols\r\n"
        websocketHeader += "Upgrade: websocket\r\n"
        websocketHeader += "Connection: Upgrade\r\n"
        websocketHeader += "Sec-WebSocket-Accept: " + websocketResponseKey
        sock.send(websocketHeader + "\r\n\r\n")

        # first check to see if the threadprocess exists for that file
        if requestDocumentId not in self._documentSocketLists:
            print "Creating a new array for this document:", requestDocumentId
            self._documentSocketLists[requestDocumentId] = []

        # add the data that will be needed later to the class's variables
        self._documentSocketLists[requestDocumentId].append(sock)
        self._socketToRequestMap[sock] = request

        return True  # reutrn that the socket succeded and should be added to the read list

    ####################### CREATE WEBSOCKET RESPONSE KEY ######################
    # This function takes in the key that was sent to the server by the        #
    # websocket and creates the response key from it. It first concatinates    #
    # the websocket string to the end of the base64 key, takes the sha1 of     #
    # that concatination and then converts the resulting sha1 hash into        #
    # base64 which is the response key.                                        #
    ############################################################################
    def createWebsocketResponseKey(baseKey):

        #print "Key:".ljust(15), baseKey
        concatinatedKey = baseKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        #print "Concat Key:".ljust(15), concatinatedKey
        hashedKey = hashlib.sha1(concatinatedKey).digest()
        #print "Hashed Key:".ljust(15), hashedKey
        base64Key = base64.b64encode(hashedKey)
        #print "Final Key:".ljust(15), base64Key

        return base64Key

    ############################### PARSE COOKIE ###############################
    # This function takes in a string containing the value of the HTTP         #
    # metadata named Cookie. It then parses the data and returns a map of the  #
    # elements of the cookie with the element names as the key and the         #
    # element values as the values                                             #
    ############################################################################
    def parseCookie(self, cookie):
        cookieObjects = {}

        cookieElements = cookie.split(";")
        for cookieElement in cookieElements:
            cookieElementSplit = cookieElement.split('=')
            cookieElementKey = cookieElementSplit[0].strip()
            cookieElementValue = cookieElementSplit[1].strip()
            cookieObjects[cookieElementKey] = cookieElementValue

        return cookieObjects

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


############################## SEND WEBSOCKET TEXT #############################
# This function takes in a string and sends it over a websocket. It adds the   #
# required header bytes in order to send the message and then sends it.        #
# The base framing protocol can be found on page 27 with a diagram on 28 of    #
# the RFC6455 Websocket Protocol document                                      #
################################################################################
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


# Initilize the Sockets class as a callable object
sockets = Sockets()
