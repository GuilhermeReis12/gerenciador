from rest_framework import serializers

from corporativo.models import Empresa
from operacoes.models import RegistroOperacional


class RegistroOperacionalSerializer(serializers.ModelSerializer):
    empresa = serializers.PrimaryKeyRelatedField(
        queryset=Empresa.objects.filter(ativo=True),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = RegistroOperacional
        fields = "__all__"
        read_only_fields = ["created_by", "created_at", "updated_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        user_empresa = getattr(request.user, "empresa", None) if request else None

        if user_empresa:
            attrs["empresa"] = user_empresa
        elif not attrs.get("empresa"):
            raise serializers.ValidationError(
                {"empresa": "Selecione uma empresa para criar o registro."}
            )

        return attrs

