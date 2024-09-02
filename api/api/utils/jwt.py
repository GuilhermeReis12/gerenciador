from rest_framework_jwt.utils import jwt_payload_handler, jwt_response_payload_handler

def custom_jwt_payload_handler(user, request=None):
    return {
        'groups': list(user.groups.values_list('name', flat=True)),
        **jwt_payload_handler(user),
    }


def custom_jwt_response_payload_handler(token, user, request=None):
    from login.serializers import UserSerializer
    return {
        'user': dict(UserSerializer(user).data, **jwt_response_payload_handler(token, user)),
    }