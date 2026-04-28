from django.db import models

from utils.models import TimestampedModel


class Empresa(TimestampedModel):
    nome = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=20, unique=True)
    ativo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"
        ordering = ["nome"]

    def __str__(self):
        return self.nome

