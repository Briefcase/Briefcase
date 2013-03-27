from collections import namedtuple
from django.conf.urls import patterns, url, include
import urls

class InvalidRegistrationInfo(Exception):
    pass

class Modules(object):

    _documentTypes = {}
    _urls = set()

    def register(self, name=None, module=None, prefix=None, urlModule=None ):
        if not name or not module or not prefix or not urlModule:
            raise InvalidRegistrationInfo("Name, module, or url info is invalid")

        if name in self._documentTypes:
            raise InvalidRegistrationInfo("Name %s has already been registered as a document name" % (name))

        else:
            self._documentTypes[name] = module


        if url in self._urls:
            raise InvalidRegistrationInfo("URL prefix %s is already in use" % url)

        else:
            urls.urlpatterns += patterns('', url(prefix, include(urlModule)))
            self._urls.add(prefix)


    def getTypes(self):
        types = []

        Type = namedtuple("Type", 'name module')

        for k in sorted(self._documentTypes.keys()):
            types.append(Type(k, self._documentTypes[k]))

        return types


module = Modules()
