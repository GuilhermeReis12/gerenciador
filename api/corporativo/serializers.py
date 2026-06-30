from django.contrib.auth import get_user_model
from rest_framework import serializers

from corporativo.models import Empresa, Equipe, UserEmpresa

User = get_user_model()


class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = "__all__"


class UserEmpresaSerializer(serializers.ModelSerializer):
    empresa_nome = serializers.CharField(source="empresa.nome", read_only=True)

    class Meta:
        model = UserEmpresa
        fields = ["id", "empresa", "empresa_nome", "is_default", "ativo"]


class EquipeSerializer(serializers.ModelSerializer):
    empresa_nome = serializers.CharField(source="empresa.nome", read_only=True)
    membros_count = serializers.SerializerMethodField()
    membros_detail = serializers.SerializerMethodField()

    class Meta:
        model = Equipe
        fields = [
            "id",
            "empresa",
            "empresa_nome",
            "nome",
            "descricao",
            "ativo",
            "membros",
            "membros_count",
            "membros_detail",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "empresa_nome", "membros_count", "membros_detail", "created_at", "updated_at"]

    def get_membros_count(self, obj):
        return obj.membros.count()

    def get_membros_detail(self, obj):
        return [
            {"id": user.id, "name": user.name or user.username, "email": user.email}
            for user in obj.membros.all()
        ]

    def validate(self, attrs):
        request = self.context.get("request")
        empresa = attrs.get("empresa") or getattr(self.instance, "empresa", None)
        if request and empresa:
            from utils.empresa_context import user_has_empresa_access

            if not user_has_empresa_access(request.user, empresa.id):
                raise serializers.ValidationError({"empresa": "Sem acesso a esta empresa."})
        return attrs


class EquipeLookupSerializer(serializers.ModelSerializer):
    membros_count = serializers.SerializerMethodField()

    class Meta:
        model = Equipe
        fields = ["id", "nome", "membros_count"]

    def get_membros_count(self, obj):
        return obj.membros.count()
