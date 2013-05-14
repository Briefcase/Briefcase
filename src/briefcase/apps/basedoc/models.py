from django.db import models
from briefcase.core.models import Document

class Basedoc(Document):
	data = models.TextField(blank=True)
	def __unicode__(self):
		return "%s - %s" % (self.file_name, unicode(self.owner))

