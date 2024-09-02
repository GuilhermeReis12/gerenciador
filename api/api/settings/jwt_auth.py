from datetime import timedelta

JWT_AUTH = {
    'JWT_ENCODE_HANDLER': 'rest_framework_jwt.utils.jwt_encode_handler',
    'JWT_PAYLOAD_HANDLER': 'api.utils.jwt.custom_jwt_payload_handler',
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'api.utils.jwt.custom_jwt_response_payload_handler',
    'JWT_EXPIRATION_DELTA': timedelta(days=1),
    'JWT_ALLOW_REFRESH': True,
}
