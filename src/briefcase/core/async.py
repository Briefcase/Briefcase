class Sockets(object):

    _openSocket = 0
    
    def testFunction(self):
        self._openSocket += 1
        print "Test sucess:",self._openSocket


sockets = Sockets()
