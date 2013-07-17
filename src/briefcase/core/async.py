import multiprocessing
import socket
import threading
import time
import hashlib
import base64
import struct

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

    # Create the socket for people to connect to!
    def __init__(self):
        print "Beginning socket"
        coreSocket = multiprocessing.Process(target=self.connectionSocket)
        coreSocket.start()

    def connectionSocket(self):
        # this is the function that handles all of the incoming socket data!?
        print "creating socket"
        # create the socket
        sock = socket.socket()
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('localhost', self._socketPort))  # connect to localhost on port 9876

        print "socket bound to port", self._socketPort

        sock.listen(1)

        while 1:
            t, _ = sock.accept()
            threading.Thread(target=handle, args=(t,)).start()

    
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



    def handle(sock):
        print '--- Got message! ---'

        data = sock.recv(4096)

        lines = data.split('\r\n')

        metadata = {}

        for line in lines:
            tokens= line.split(':')
            if len(tokens) < 2:
                continue
            name = tokens[0]
            value = tokens[1]

            metadata[name] = value
            print ("("+name+")").ljust(27), value
        
     
        baseKey = metadata['Sec-WebSocket-Key'].strip()
        #baseKey = "dGhlIHNhbXBsZSBub25jZQ=="
        print "Key:".ljust(15), baseKey
        concatinatedKey = baseKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        print "Concat Key:".ljust(15), concatinatedKey
        hashedKey = hashlib.sha1(concatinatedKey).digest()
        print "Hashed Key:".ljust(15), hashedKey
        base64Key = base64.b64encode(hashedKey)
        print "Final Key:".ljust(15), base64Key

        websocketHeader = """HTTP/1.1 101 Switching Protocols\r
        Upgrade: websocket\r
        Connection: Upgrade\r
        Sec-WebSocket-Accept: """ + base64Key

        print websocketHeader

        sock.send(websocketHeader + "\r\n\r\n")

        time.sleep(1)
        print "Sent Hello?"
        sendWebsocketText(sock, "hello")

        time.sleep(1)
        print "Sent World?"
        sendWebsocketText(sock, "Ok lets try somehting a little longer then what we have been doing before. A nice long sentance will suffice to prove that we can also send data taht is much longer then what we would normally send but possibly have hte ability to do a longer message if needed. 125 bytes is a little short when sending a webpage or some junk")

        time.sleep(1)
        print "Finished"
        sock.close()

    # sock = socket.socket()
    # sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    # sock.bind(('', 9876))  # connect to localhost on port 9876

    # sock.listen(1)

    # while 1:
    #     t, _ = sock.accept()
    #     threading.Thread(target=handle, args=(t,)).start()


print " -- running server from", __name__
sockets = Sockets()
