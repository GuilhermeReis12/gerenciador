from django.conf import settings
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


class UserEmpresa(TimestampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="empresa_memberships",
    )
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name="user_memberships",
    )
    is_default = models.BooleanField(default=False)
    ativo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Vínculo Usuário-Empresa"
        verbose_name_plural = "Vínculos Usuário-Empresa"
        unique_together = ("user", "empresa")
        ordering = ["-is_default", "empresa__nome"]

    def __str__(self):
        return f"{self.user_id} -> {self.empresa.nome}"


class Equipe(TimestampedModel):
    empresa = models.ForeignKey(
        Empresa,
        on_delete=models.CASCADE,
        related_name="equipes",
    )
    nome = models.CharField(max_length=120)
    descricao = models.TextField(blank=True, null=True)
    ativo = models.BooleanField(default=True)
    membros = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="equipes_operacionais",
        blank=True,
    )

    class Meta:
        verbose_name = "Equipe Operacional"
        verbose_name_plural = "Equipes Operacionais"
        unique_together = ("empresa", "nome")
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.empresa.nome})"
