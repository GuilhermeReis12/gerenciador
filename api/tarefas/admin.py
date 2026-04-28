from django.contrib import admin

from tarefas.models import Tarefa


@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "user", "status", "prioridade", "data_limite", "arquivada")
    list_filter = ("status", "prioridade", "arquivada")
    search_fields = ("titulo", "descricao", "user__username", "user__email")

