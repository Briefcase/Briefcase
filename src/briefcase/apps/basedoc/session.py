from models import Basedoc
import json
##################################################
## SpreadsheetSession - used for holding the changeset and
## exchanging data between clients/db
## - changes received from one user are used to update the db
##      and added to the other users' list of new changes
## - when a user sends changes to the server, the server sends back
##      that user's list of new changes which are then used to
##      update their version of the spreadsheet. After sending, the
##      server clears the list - the list only holds changes the 
##      client/user hasn't updated to yet
##
##
##    example: client A sending changes
##                               |       server:
##           client A -----------|-------> db
##                 <-------------|-----   client A's list
##                               | -----> client B's list
##                               | -----> client C's list
##                                                    
##                                    
#############################################################
class Session:
    #initialize with sheet id
    def __init__(self, sheet_id):
        self.sheet_id = sheet_id #id (primary key) of the spreadsheet in the db
        self.clientlists=[]
        
        # asherlist = ClientList(unicode('asher'))
        # data = {"2,2":"ashers data"}
        # asherlist.add_to_list(data)
        # self.clientlists.append(asherlist)
        
        
    #receive changes from client
    def receive(self, data, user):
        #add data to all other client's lists AND 
        #check to make sure this is not a new client we 
        #are receiving from
        is_new = True
        for c in self.clientlists:
            if  not c.user == user:
                #print "other user, adding data"
                c.add_to_list(data)
            else:
                #print "ran into myself"
                is_new=False
        if is_new:
            #print "new one"
            new_c = ClientList(user)
            self.clientlists.append(new_c)
        
        #also update database
        self.update_db(data)
        #send change list back to client
        return self.send_list(user)
                

    #update the spreadsheet in db
    def update_db(self, data):
        s = Spreadsheet.objects.get(pk=self.sheet_id)
        cur_data = json.loads(s.data)
        changes = json.loads(data)
        for key in changes:
            cur_data[key] = changes[key] #update cell info
        s.data =json.dumps(cur_data)
        s.save() # save the data
        return
            
        
        
        

    
    #send (return) the new changes to the client
    def send_list(self, user):
        #print "send list"
        for c in self.clientlists:
            if c.user == user:
                #print c.changelist
                returnValue = []
                returnValue.extend(c.changelist)
                del self.clientlists[self.clientlists.index(c)].changelist[:]
                return returnValue
                
class ClientList:
    #initialize with username
    def __init__(self, user):
        self.user = user
        self.changelist=[] #list of changes (which are dicts)
        
    def add_to_list(self, data):
        self.changelist.append(data)