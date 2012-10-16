#briefcase.core.spreadsheet.urls
from django.conf.urls import patterns, include, url


urlpatterns = patterns('briefcase.core.spreadsheet',
    url(r'^(\d{1,})/$', 'views.home'),
    url(r'^load/$', 'views.load'),
    url(r'^new/$', 'views.new'),
    url(r'^devsave/$', 'views.dev_save'),
 )
