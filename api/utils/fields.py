from django.db import models
from django.utils.translation import gettext_lazy as _

class CustomDateTimeField(models.DateTimeField):
    description = _("Custom DateTime field")

    def db_type(self, connection):
        if connection.vendor == 'microsoft':
            return 'datetime2'
        else:
            return super().db_type(connection)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        return name, path, args, kwargs


class CustomTimeField(models.TimeField):
    description = _("Custom Time field")

    def db_type(self, connection):
        if connection.vendor == 'microsoft':
            return 'time'
        else:
            return super().db_type(connection)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        return name, path, args, kwargs


class CustomDecimalField(models.DecimalField):
    description = _("Custom Decimal field")

    def db_type(self, connection):
        if connection.vendor == 'microsoft':
            return 'decimal'
        else:
            return super().db_type(connection)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        return name, path, args, kwargs


class CustomCharField(models.CharField):
    description = _("Custom Char field")

    def db_type(self, connection):
        if connection.vendor == 'microsoft':
            return 'char'
        else:
            return super().db_type(connection)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        return name, path, args, kwargs
