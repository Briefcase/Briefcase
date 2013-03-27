#core urls
from django.conf.urls import patterns, include, url



urlpatterns = patterns('briefcase.core',
    url(r'^', include('briefcase.core.accounts.urls')),
    url(r'^delete/', 'views.delete'),
    url(r'^rename/','views.rename'),

    )
