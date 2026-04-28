from django.contrib import admin

from tarefas.models import Tarefa, TarefaAuditLog


@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "user", "status", "prioridade", "data_limite", "arquivada")
    list_filter = ("status", "prioridade", "arquivada")
    search_fields = ("titulo", "descricao", "user__username", "user__email")


@admin.register(TarefaAuditLog)
class TarefaAuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "action", "user", "tarefa", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("payload", "user__username", "tarefa__titulo")

