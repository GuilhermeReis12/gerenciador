from rest_framework import serializers

from tarefas.models import Tarefa, TarefaStatus, TarefaAuditLog


class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = [
            "id",
            "empresa",
            "titulo",
            "descricao",
            "status",
            "prioridade",
            "data_limite",
            "concluida_em",
            "arquivada",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "empresa", "concluida_em", "created_at", "updated_at"]

    def validate(self, attrs):
        data_limite = attrs.get("data_limite")
        titulo = attrs.get("titulo", "")
        if titulo and len(titulo.strip()) < 3:
            raise serializers.ValidationError(
                {"titulo": "O título deve ter pelo menos 3 caracteres."}
            )
        if data_limite and data_limite.year < 2000:
            raise serializers.ValidationError(
                {"data_limite": "Data limite inválida para o planejamento corporativo."}
            )
        status = attrs.get("status")
        if status == TarefaStatus.DONE:
            # concluida_em será setado no update, mantendo consistência
            pass
        return attrs


class TarefaUpdateSerializer(TarefaSerializer):
    class Meta(TarefaSerializer.Meta):
        read_only_fields = ["id", "created_at", "updated_at"]


class TarefaAuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    payload_json = serializers.SerializerMethodField()

    class Meta:
        model = TarefaAuditLog
        fields = [
            "id",
            "action",
            "payload",
            "payload_json",
            "created_at",
            "user_name",
            "tarefa",
        ]

    def get_user_name(self, obj):
        if not obj.user:
            return "Sistema"
        return obj.user.username

    def get_payload_json(self, obj):
        return obj.get_payload()

