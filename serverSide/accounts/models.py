##
#accounts.models
##
from django.db import models
from django.contrib.auth.models import User


# UserProfile holds django's default user model.
# Doing this gives more flexibility to what can be stored as basic information for each user.
# In order to access the follow use user.x (ie self.user.username instead of self.username)
#   username
#   first_name
#   last_name
#   email
class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True)
    #phone
    #address
    def __unicode__(self):
        return self.user.username
        
class Spreadsheet(models.Model):
    owner = models.ForeignKey(UserProfile, related_name = "owner")
    file_name = models.CharField(max_length = 20, primary_key=True)
    data = models.TextField()
    allowed_users = models.ManyToManyField(UserProfile, related_name="allowed_users", null=True, blank=True)
    def __unicode__(self):
        return self.file_name
