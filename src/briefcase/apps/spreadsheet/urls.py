#briefcase.apps.spreadsheet.urls

# This `urls.py` is used to direct the location of the requests of each of the urls
# to a seperate function

from django.conf.urls import patterns, include, url

urlpatterns = patterns('briefcase.apps.spreadsheet',
                       url(r'^(\d{1,})/$', 'views.home'),
                       url(r'^load/$', 'views.load'),
                       url(r'^new/$', 'views.new'),
                       url(r'^devsave/$', 'views.devsave'),
                       url(r'^autosave/$', 'views.autosave'),
                       url(r'^socket/$', 'views.socketTest'),
                       )
