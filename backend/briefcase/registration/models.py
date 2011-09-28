from django.db import models
from django.contrib.auth.models import User

class UserProfile (models.Model):
    user = models.OneToOneField(User)
    activation_key = models.CharField(maxlength = 40)
