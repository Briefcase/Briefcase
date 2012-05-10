from django.db import models
######
# spreadsheet.models
#####
from serverSide.accounts.models import UserProfile

class Spreadsheet(models.Model):
    owner = models.ForeignKey(UserProfile, related_name = "my_spreadsheets")
    file_name = models.CharField(max_length = 20)
    data = models.TextField()
    allowed_users = models.ManyToManyField(UserProfile, related_name="allowed_spreadsheets", null=True, blank=True)
    view_only_users = models.ManyToManyField(UserProfile, related_name="view_only_spreadsheets", null=True, blank=True)
    public = models.BooleanField()
    def __unicode__(self):
        return self.file_name