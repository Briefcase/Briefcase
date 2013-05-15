Briefcase
=========

Briefcase is an online document editor. Meant to create usable programs to help people edit and distribute documents.

Briefcase is under the BSD licence, full text found at the end of this file
Briefcase is an open source online document editor
The backend is written in Django
Briefcase uses the canvas element and requires the use of modern browsers

Want To Help? Fork the repo and write some functions!

Planned Applications
====================
Spreadsheet [In Development]  
Presentation Editor [Beginning Development]   
Code Editor [In Development]  

Developer Setup Instructions
============================
Briefcase works with a sepearate socketio process so there will be two processes that will be running  
`python manage.py runserver_socketio` Begin the Socket Server  
`python manage.py runserver` Begin the Django Server  
before you start you will also need to sync the database to the current model view  
`python manage.py syncdb` To sync the database  
If you want to use the flashsocket fallback for socketio you will need to run `runserver_socketio` using `sudo`  
`sudo python manage.py runserver_socketio`  

Licence
=======
Copyright 2011 Asher Glick. All rights reserved.  

Redistribution and use in source and binary forms, with or without modification, are  
permitted provided that the following conditions are met:  

   1. Redistributions of source code must retain the above copyright notice, this list of  
      conditions and the following disclaimer.  

   2. Redistributions in binary form must reproduce the above copyright notice, this list  
      of conditions and the following disclaimer in the documentation and/or other materials  
      provided with the distribution.  

THIS SOFTWARE IS PROVIDED BY Asher Glick ''AS IS'' AND ANY EXPRESS OR IMPLIED  
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND  
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Asher Glick OR  
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR  
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR  
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON  
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING  
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF  
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  

The views and conclusions contained in the software and documentation are those of the  
authors and should not be interpreted as representing official policies, either expressed  
or implied, of Asher Glick.  


We Have Hit 1000 Commits!
