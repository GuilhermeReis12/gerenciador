from itertools import chain

from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework import exceptions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.response import Response

class JWTAuthentication(JSONWebTokenAuthentication):
    PAYLOAD_FIELD_MAP = {'id': 'user_id', 'username': 'username'}

    def get_deferred_fields(self):
        all_fields_names = {
            (field.name, field.attname) if hasattr(field, 'attname') else (field.name,)
            for field in get_user_model()._meta.get_fields()
            if not (field.many_to_one and field.related_model is None)
        }
        all_fields_list = set(chain.from_iterable(all_fields_names))
        payload_fields = set(self.PAYLOAD_FIELD_MAP.keys())
        return all_fields_list.difference(payload_fields)

    def create_user_from_payload(self, payload):
        try:
            kwargs = {
                key: payload[value] for key, value in self.PAYLOAD_FIELD_MAP.items()
            }
        except KeyError as exc:
            raise exceptions.AuthenticationFailed(_('Invalid payload.')) from exc

        user = get_user_model()(**kwargs)
        deferred_fields = self.get_deferred_fields()
        for field in deferred_fields:
            try:
                delattr(user, field)
            except AttributeError as attrib_err:
                return Response(status=400, data={attrib_err})
        return user

    def authenticate_credentials(self, payload):
        if not payload.get('user_id'):
            raise exceptions.AuthenticationFailed(
                _('User id not found in jwt payload.')
            )

        user = get_user_model().objects.get(id=payload['user_id'])
        return user