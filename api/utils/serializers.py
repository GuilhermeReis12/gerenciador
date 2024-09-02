import json

from django.utils.translation import gettext as _
from rest_framework import serializers, exceptions


class JsonField(serializers.CharField):
    def is_json(self, value):
        try:
            json.loads(value)
        except ValueError as exc:
            raise exceptions.ValidationError(_("Invalid format.")) from exc
        return True

    def to_internal_value(self, data):
        if isinstance(data, str):
            self.is_json(data)
            return data

        if data:
            try:
                return json.dumps(data)
            except json.JSONDecodeError as exc:
                raise exceptions.ValidationError(_("Invalid format.")) from exc
        return None

    def to_representation(self, value):
        if value:
            return json.loads(value)
        return value
