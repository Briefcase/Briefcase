from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    name = models.CharField(max_length=30)
    user = models.ForeignKey(User, unique=True)
    randomfield = models.CharField(max_length=10)
    def __unicode__(self):
        return self.name
