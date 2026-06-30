from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers

from corporativo.models import Equipe
from tarefas.models import GroupPermission, Notificacao, Tarefa, TarefaAuditLog, TarefaStatus

User = get_user_model()


class TarefaSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    assigned_team_name = serializers.SerializerMethodField()
    is_assigned_to_me = serializers.SerializerMethodField()
    can_work = serializers.SerializerMethodField()
    empresa_nome = serializers.SerializerMethodField()

    class Meta:
        model = Tarefa
        fields = [
            "id",
            "empresa",
            "empresa_nome",
            "user",
            "created_by_name",
            "titulo",
            "descricao",
            "link",
            "status",
            "prioridade",
            "data_limite",
            "concluida_em",
            "arquivada",
            "assigned_to",
            "assigned_to_name",
            "assigned_team",
            "assigned_team_name",
            "is_assigned_to_me",
            "can_work",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "empresa",
            "empresa_nome",
            "user",
            "created_by_name",
            "concluida_em",
            "assigned_to_name",
            "assigned_team_name",
            "is_assigned_to_me",
            "can_work",
            "created_at",
            "updated_at",
        ]

    def get_empresa_nome(self, obj):
        return obj.empresa.nome if obj.empresa else None

    def get_created_by_name(self, obj):
        return obj.user.name or obj.user.username

    def get_assigned_to_name(self, obj):
        if not obj.assigned_to:
            return None
        return obj.assigned_to.name or obj.assigned_to.username

    def get_assigned_team_name(self, obj):
        return obj.assigned_team.nome if obj.assigned_team else None

    def get_is_assigned_to_me(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        from tarefas.permissions_service import user_is_assigned_to_task

        return user_is_assigned_to_task(request.user, obj)

    def get_can_work(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        from tarefas.permissions_service import can_user_complete_task

        return can_user_complete_task(request.user, obj)

    def validate_titulo(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("O título é obrigatório.")
        if len(value.strip()) < 3:
            raise serializers.ValidationError("O título deve ter pelo menos 3 caracteres.")
        return value.strip()

    def validate(self, attrs):
        is_create = self.instance is None
        data_limite = attrs.get("data_limite", getattr(self.instance, "data_limite", None))

        if is_create and not data_limite:
            raise serializers.ValidationError({"data_limite": "O prazo é obrigatório."})

        if data_limite and data_limite.year < 2000:
            raise serializers.ValidationError(
                {"data_limite": "Data limite inválida para o planejamento corporativo."}
            )

        assigned_to = attrs.get("assigned_to")
        assigned_team = attrs.get("assigned_team")
        if assigned_to and assigned_team:
            raise serializers.ValidationError(
                {"assigned_team": "Informe apenas um usuário ou uma equipe operacional, não ambos."}
            )

        if is_create:
            request = self.context.get("request")
            if request:
                from tarefas.permissions_service import get_user_capabilities
                from utils.empresa_context import get_active_empresa_id

                capabilities = get_user_capabilities(request.user)
                if not capabilities["can_create_tasks"]:
                    raise serializers.ValidationError(
                        {"detail": "Seu perfil não pode criar tarefas."}
                    )
                if (assigned_to or assigned_team) and not capabilities["can_assign_tasks"]:
                    raise serializers.ValidationError(
                        {"assigned_to": "Seu perfil não pode atribuir tarefas."}
                    )
                if not assigned_to and not assigned_team:
                    raise serializers.ValidationError(
                        {"assigned_to": "Atribua a tarefa a um usuário ou equipe operacional."}
                    )
                if not get_active_empresa_id(request):
                    raise serializers.ValidationError(
                        {"empresa": "Selecione uma empresa ativa antes de criar tarefas."}
                    )
                if assigned_team and assigned_team.empresa_id != get_active_empresa_id(request):
                    raise serializers.ValidationError(
                        {"assigned_team": "A equipe deve pertencer à empresa ativa."}
                    )
                if assigned_to:
                    empresa_id = get_active_empresa_id(request)
                    from corporativo.models import UserEmpresa

                    belongs_to_empresa = (
                        assigned_to.empresa_id == empresa_id
                        or UserEmpresa.objects.filter(
                            user=assigned_to, empresa_id=empresa_id, ativo=True
                        ).exists()
                    )
                    if not belongs_to_empresa:
                        raise serializers.ValidationError(
                            {"assigned_to": "O usuário não pertence à empresa ativa."}
                        )

        if assigned_to and not User.objects.filter(pk=assigned_to.pk, is_active=True).exists():
            raise serializers.ValidationError({"assigned_to": "Usuário inválido ou inativo."})

        if assigned_team and not Equipe.objects.filter(pk=assigned_team.pk, ativo=True).exists():
            raise serializers.ValidationError({"assigned_team": "Equipe inválida ou inativa."})

        return attrs


class TarefaAssigneeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = ["status", "prioridade"]

    def validate(self, attrs):
        request = self.context.get("request")
        if request:
            from tarefas.permissions_service import can_user_complete_task

            if not can_user_complete_task(request.user, self.instance):
                raise serializers.ValidationError(
                    {"detail": "Você não possui permissão para atualizar esta tarefa."}
                )
        return attrs


class TarefaUpdateSerializer(TarefaSerializer):
    class Meta(TarefaSerializer.Meta):
        read_only_fields = [
            "id",
            "empresa",
            "user",
            "created_by_name",
            "concluida_em",
            "assigned_to_name",
            "assigned_team_name",
            "is_assigned_to_me",
            "can_work",
            "created_at",
            "updated_at",
        ]


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


class NotificacaoSerializer(serializers.ModelSerializer):
    tarefa_titulo = serializers.CharField(source="tarefa.titulo", read_only=True)

    class Meta:
        model = Notificacao
        fields = [
            "id",
            "tipo",
            "titulo",
            "mensagem",
            "lida",
            "tarefa",
            "tarefa_titulo",
            "created_at",
        ]
        read_only_fields = fields


class UserLookupSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "role", "groups"]

    def get_groups(self, obj):
        return list(obj.groups.values_list("name", flat=True))


class GroupLookupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]


class GroupPermissionSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = GroupPermission
        fields = [
            "id",
            "group",
            "group_name",
            "can_create_tasks",
            "can_assign_tasks",
            "can_view_all_tasks",
            "can_manage_team",
            "can_complete_assigned",
            "can_archive_tasks",
            "can_delete_tasks",
            "can_manage_permissions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "group_name", "created_at", "updated_at"]


class UserCapabilitiesSerializer(serializers.Serializer):
    role = serializers.CharField()
    groups = serializers.ListField(child=serializers.CharField())
    can_create_tasks = serializers.BooleanField()
    can_assign_tasks = serializers.BooleanField()
    can_view_all_tasks = serializers.BooleanField()
    can_manage_team = serializers.BooleanField()
    can_complete_assigned = serializers.BooleanField()
    can_archive_tasks = serializers.BooleanField()
    can_delete_tasks = serializers.BooleanField()
    can_manage_permissions = serializers.BooleanField()
    can_manage_equipes = serializers.BooleanField()
