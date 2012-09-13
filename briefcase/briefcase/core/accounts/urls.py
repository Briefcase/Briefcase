#briefcase.core.accounts.urls
from django.conf.urls import patterns, include, url


urlpatterns = patterns('briefcase.core.accounts',
    url(r'^$', 'views.home'),
    url(r'^register/$', 'views.register'),
    url(r'^logout/$', 'views.logout_user'),

 )

urlpatterns += patterns('',
    url(r'^login/', 'django.contrib.auth.views.login', {'template_name': 'accounts/welcome.html'}),

    )
