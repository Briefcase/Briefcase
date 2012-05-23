from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    #account stuff
    url(r'^$', 'accounts.views.index'),
    url(r'^accounts/$', 'accounts.views.userprofile'),
    url(r'^accounts/register', 'accounts.views.register'),
    url(r'^accounts/logout','accounts.views.userlogout'),
    #spreadsheet stuff
    url(r'^spreadsheet/$', 'spreadsheet.views.spreadsheet'),
    #new
    url(r'^spreadsheet/new', 'spreadsheet.views.new'),
    url(r'^spreadsheet/load', 'spreadsheet.views.load'),
    #autosave
    url(r'^spreadsheet/autosave', 'spreadsheet.views.autosave'),
    #delete
    url(r'^spreadsheet/delete', 'spreadsheet.views.delete'),
    url(r'^spreadsheet/rename', 'spreadsheet.views.rename'),
    url(r'^spreadsheet/returnsettings', 'spreadsheet.views.returnsettings'),
    url(r'^spreadsheet/changesettings', 'spreadsheet.views.changesettings'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
 
)



#serves static files - ONLY FOR USE IN DEVELOPMENT
if settings.DEBUG:
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^spreadsheet/static/(?P<path>.*)$', 'serve'),
        url(r'^accounts/static/(?P<path>.*)$','serve'),
    )
    
urlpatterns+=staticfiles_urlpatterns()