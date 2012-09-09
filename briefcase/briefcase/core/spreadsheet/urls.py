#briefcase.core.spreadsheet.urls
from django.conf.urls import patterns, include, url


urlpatterns = patterns('briefcase.core.spreadsheet',
    url(r'^$', 'views.home')
 )
