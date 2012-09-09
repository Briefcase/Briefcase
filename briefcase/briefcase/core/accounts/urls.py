#briefcase.core.accounts.urls
from django.conf.urls import patterns, include, url


urlpatterns = patterns('briefcase.core.accounts',
    url(r'^$', 'views.home'),

 )

urlpatterns += patterns('',
    url(r'^login/', 'django.contrib.auth.views.login', {'template_name': 'accounts/welcome.html'}),

    )
