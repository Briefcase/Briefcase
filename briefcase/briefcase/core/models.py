from django.db import models
from django.contrib.auth.models import User


class Document(models.Model):
    owner = models.ForeignKey(User, related_name='owner')
    file_name = models.CharField(max_length=50)
    allowed_users = models.ManyToManyField(User, related_name = "allowed_docs", null=True, blank=True)
    view_only_users = models.ManyToManyField(User, related_name = "view_only_docs", null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add = True)
    modified_date = models.DateTimeField(auto_now = True)
    module = models.CharField(max_length=100)



