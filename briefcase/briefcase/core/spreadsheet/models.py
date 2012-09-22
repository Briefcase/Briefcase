from django.db import models
from briefcase.core.models import Document
from briefcase import core

class Spreadsheet(Document):
    data = models.TextField(blank=True)
    def __unicode__(self):
        return "%s - %s" % (self.file_name, unicode(self.owner))

core.module.register("Spreadsheet", "briefcase.core.spreadsheet.views.new")

