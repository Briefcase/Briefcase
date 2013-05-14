#briefcase.apps.spreadsheet.urls
from django.conf.urls import patterns, include, url


urlpatterns = patterns('briefcase.apps.spreadsheet',
    url(r'^(\d{1,})/$', 'views.home'),
    url(r'^load/$', 'views.load'),
    url(r'^new/$', 'views.new'),
    url(r'^devsave/$', 'views.devsave'),
    url(r'^autosave/$', 'views.autosave'),
 )
