from django.conf import settings
from django.db import models
from django.utils import timezone
import json
from corporativo.models import Empresa

from utils.models import TimestampedModel


class TarefaStatus(models.TextChoices):
    TODO = "TODO", "A fazer"
    IN_PROGRESS = "IN_PROGRESS", "Em andamento"
    DONE = "DONE", "Concluída"


class TarefaPrioridade(models.TextChoices):
    LOW = "LOW", "Baixa"
    MEDIUM = "MEDIUM", "Média"
    HIGH = "HIGH", "Alta"


class Tarefa(TimestampedModel):
    empresa = models.ForeignKey(
        Empresa, on_delete=models.CASCADE, related_name="tarefas", null=True, blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tarefas",
    )
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=TarefaStatus.choices, default=TarefaStatus.TODO
    )
    prioridade = models.CharField(
        max_length=10, choices=TarefaPrioridade.choices, default=TarefaPrioridade.MEDIUM
    )
    data_limite = models.DateField(blank=True, null=True)
    concluida_em = models.DateTimeField(blank=True, null=True)
    arquivada = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Tarefa"
        verbose_name_plural = "Tarefas"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "prioridade"]),
            models.Index(fields=["user", "arquivada"]),
            models.Index(fields=["user", "data_limite"]),
        ]

    def marcar_concluida(self):
        self.status = TarefaStatus.DONE
        self.concluida_em = timezone.now()

    def marcar_aberta(self):
        if self.status == TarefaStatus.DONE:
            self.status = TarefaStatus.TODO
        self.concluida_em = None

    def __str__(self):
        return self.titulo


class AuditAction(models.TextChoices):
    CREATED = "CREATED", "Criada"
    UPDATED = "UPDATED", "Atualizada"
    DELETED = "DELETED", "Excluída"
    STATUS_CHANGED = "STATUS_CHANGED", "Status alterado"
    ARCHIVED = "ARCHIVED", "Arquivada"
    RESTORED = "RESTORED", "Desarquivada"
    BULK_UPDATED = "BULK_UPDATED", "Atualização em lote"


class TarefaAuditLog(TimestampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    tarefa = models.ForeignKey(
        "Tarefa", on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs"
    )
    action = models.CharField(max_length=30, choices=AuditAction.choices)
    payload = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Log de Tarefa"
        verbose_name_plural = "Logs de Tarefas"
        ordering = ["-created_at"]

    def set_payload(self, value):
        self.payload = json.dumps(value, ensure_ascii=False, default=str) if value else None

    def get_payload(self):
        if not self.payload:
            return None
        try:
            return json.loads(self.payload)
        except Exception:
            return self.payload

