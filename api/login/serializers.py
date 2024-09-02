# Importe os módulos necessários
from rest_framework import serializers
from .models import User
from utils.s3 import generate_presigned_url
from rest_framework.views import APIView
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate, get_user_model
from rest_framework_jwt.settings import api_settings
from .utils import validate_passwords

User = get_user_model()

user_form_fields = [
    "id",
    "username",
    "name",
    "email",
    "is_active",
    "user_image",
]


class UpdateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = get_user_model()
        fields = list(user_form_fields)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "groups",
            "person",
        ]


class UserForm(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "person", "password"]


class CriarSenhaSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=128)
    confirm_password = serializers.CharField(max_length=128)

    def validate(self, values):
        p1 = values["password"]
        p2 = values["confirm_password"]
        validate_passwords(p1, p2)
        return values


class AuthSerializer(JSONWebTokenSerializer):

    def validate(self, attrs):
        """
        Most of this method was copied from JSONWebTokenSerializer.
        The only change was to add the method that managers user session.
        """
        credentials = {
            self.username_field: attrs.get(self.username_field),
            "password": attrs.get("password"),
        }

        if all(credentials.values()):
            user = authenticate(**credentials)

            if user:
                if not user.is_active:
                    msg = "Usuário inativo."
                    raise serializers.ValidationError(msg)

                payload = api_settings.JWT_PAYLOAD_HANDLER(user)

                return {"token": api_settings.JWT_ENCODE_HANDLER(payload), "user": user}

            msg = "Usuário ou senha inválidos."
            raise serializers.ValidationError(msg)

        msg = f'Favor incluir {username_field} e "password".'
        msg = msg.format(username_field=self.username_field)

        raise serializers.ValidationError(msg)


class MeSerializer(serializers.ModelSerializer):
    link_img = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__"

    def get_link_img(self, obj):
        if obj.user_image:
            url = generate_presigned_url(obj.user_image)
            return url
        return ""
