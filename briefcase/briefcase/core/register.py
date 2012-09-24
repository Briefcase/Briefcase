from collections import namedtuple

class InvalidRegistrationInfo(Exception):
    pass

class Modules(object):

    documentTypes = {}

    def register(self, name=None, module=None):
        if not name or not module:
            raise InvalidRegistrationInfo("Name or module info is invalid")

        if name in self.documentTypes:
            raise InvalidRegistrationInfo("Name %s has already been registered as a document name" % (name))

        else:
            self.documentTypes[name] = module

    def getTypes(self):
        types = []

        Type = namedtuple("Type", 'name module')

        for k in sorted(self.documentTypes.keys()):
            types.append(Type(k, self.documentTypes[k]))

        return types


module = Modules()
