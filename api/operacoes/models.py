from django.conf import settings
from django.db import models

from corporativo.models import Empresa
from utils.models import TimestampedModel


class RegistroTipo(models.TextChoices):
    TASK = "TASK", "Tarefa"
    PRODUCT = "PRODUCT", "Produto"
    STOCK = "STOCK", "Estoque"


class RegistroOperacional(TimestampedModel):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="registros")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    tipo = models.CharField(max_length=20, choices=RegistroTipo.choices)
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    sku = models.CharField(max_length=80, blank=True, null=True)
    quantidade = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    unidade = models.CharField(max_length=20, default="UN")
    ativo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Registro Operacional"
        verbose_name_plural = "Registros Operacionais"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["empresa", "tipo"]),
            models.Index(fields=["empresa", "sku"]),
            models.Index(fields=["empresa", "ativo"]),
        ]

    def __str__(self):
        return f"{self.tipo} - {self.titulo}"

