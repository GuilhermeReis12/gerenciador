from rest_framework import serializers

from operacoes.models import RegistroOperacional


class RegistroOperacionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroOperacional
        fields = "__all__"
        read_only_fields = ["empresa", "created_by", "created_at", "updated_at"]

