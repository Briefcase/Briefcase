from collections import namedtuple

class InvalidRegistrationInfo(Exception):
    pass

class Modules(object):

    _documentTypes = {}

    def register(self, name=None, module=None):
        if not name or not module:
            raise InvalidRegistrationInfo("Name or module info is invalid")

        if name in self._documentTypes:
            raise InvalidRegistrationInfo("Name %s has already been registered as a document name" % (name))

        else:
            self._documentTypes[name] = module

    def getTypes(self):
        types = []

        Type = namedtuple("Type", 'name module')

        for k in sorted(self._documentTypes.keys()):
            types.append(Type(k, self._documentTypes[k]))

        return types


module = Modules()
