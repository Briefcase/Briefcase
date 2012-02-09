from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^accounts/$', 'accounts.views.index'),
    url(r'^accounts/register', 'accounts.views.register'),
    url(r'^accounts/login', 'accounts.views.userlogin'),
    url(r'^accounts/logout','accounts.views.userlogout'),
    url(r'^accounts/uploadfile','accounts.views.save_file'),
    url(r'^$', 'frontend.views.index'),
    url(r'^spreadsheet/$', 'frontend.views.spreadsheet'),
    url(r'^spreadsheet/save', 'accounts.views.save'),
    url(r'^spreadsheet/load', 'accounts.views.load'),
    
    #url(r'^accounts/confirm', 'accounts.views.confirm'),
    # Examples:
    #url(r'^$', 'briefcase.views.home', name='home'),
    # url(r'^briefcase/', include('briefcase.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)


#serves static files - ONLY FOR USE IN DEVELOPMENT
if settings.DEBUG:
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^spreadsheet/static/(?P<path>.*)$', 'serve'),
    )
    
urlpatterns+=staticfiles_urlpatterns()