from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin


class Document(models.Model):
    owner = models.ForeignKey(User)
    file_name = models.CharField(max_length=50)
    allowed_users = models.ManyToManyField(User, related_name = "allowed_docs", null=True)
    view_only_users = models.ManyToManyField(User, related_name = "view_only_docs", null=True)
    created_date = models.DateTimeField(auto_now_add = True)
    modified_date = models.DateTimeField(auto_now = True)
    module = models.CharField(max_length=100)


class DocumentType(models.Model):
    name = models.CharField(max_length=25, unique=True)
    new_module = models.CharField(max_length=100)


admin.site.register(DocumentType)
