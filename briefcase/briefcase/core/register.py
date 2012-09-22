from briefcase.core.models import DocumentType
from django.db.utils import DatabaseError, IntegrityError

class InvalidRegistrationInfo(Exception):
    pass

class Modules(object):

    def __init__(self):
        try:
            DocumentType.objects.all().delete()

        except(DatabaseError):
            pass

    def register(self, name=None, module=None):
        if not name or not module:
            raise InvalidRegistrationInfo("Name or module info is invalid")

        try:
            DocumentType(name=name, new_module=module).save()

        except(IntegrityError):
            raise InvalidRegistrationInfo("Name %s has already been registered as a document name" % (name))

module = Modules()
