from django.contrib.auth import password_validation
from rest_framework.exceptions import ValidationError


def validate_passwords(p1, p2):
    passwords_match = p1 == p2
    if not passwords_match:
        msg = "As senhas informadas são diferentes."
        raise ValidationError([msg])

    validators = [
        password_validation.MinimumLengthValidator,
        password_validation.CommonPasswordValidator,
        password_validation.NumericPasswordValidator,
    ]

    for validator in validators:
        validator().validate(p1)
