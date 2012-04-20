##
#accounts.models
##
from django.db import models
from django.contrib.auth.models import User


# UserProfile holds django's default user model.
class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True)
    #phone
    #address
    def __unicode__(self):
        return self.user.username
