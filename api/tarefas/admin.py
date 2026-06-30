from django.contrib import admin

from tarefas.models import GroupPermission, Notificacao, Tarefa, TarefaAuditLog


@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "titulo",
        "user",
        "assigned_to",
        "assigned_team",
        "status",
        "prioridade",
        "data_limite",
        "arquivada",
    )
    list_filter = ("status", "prioridade", "arquivada")
    search_fields = ("titulo", "descricao", "user__username", "user__email")


@admin.register(TarefaAuditLog)
class TarefaAuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "action", "user", "tarefa", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("payload", "user__username", "tarefa__titulo")


@admin.register(GroupPermission)
class GroupPermissionAdmin(admin.ModelAdmin):
    list_display = (
        "group",
        "can_create_tasks",
        "can_assign_tasks",
        "can_manage_team",
        "can_complete_assigned",
        "can_manage_permissions",
    )
    search_fields = ("group__name",)


@admin.register(Notificacao)
class NotificacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "user", "tipo", "lida", "created_at")
    list_filter = ("tipo", "lida")
    search_fields = ("titulo", "mensagem", "user__username")

