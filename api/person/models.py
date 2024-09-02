from django.db import models
from utils.models import TimestampedModel


class State(models.Model):
    name = models.TextField(null=True, blank=True)
    uf = models.CharField(max_length=2, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.uf}"


class City(models.Model):
    name = models.TextField(null=True, blank=True)
    state = models.ForeignKey("State", models.DO_NOTHING)

    def __str__(self):
        return f"{self.name}"


class Person(TimestampedModel):
    nome = models.CharField(max_length=250, null=True, blank=True)
    sobrenome = models.CharField(max_length=250, null=True, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    cep = models.CharField(max_length=255, blank=True, null=True)
    logradouro = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=30, blank=True, null=True)
    complemento = models.CharField(max_length=255, blank=True, null=True)
    bairro = models.CharField(max_length=255, blank=True, null=True)
    estado = models.ForeignKey(
        "State", related_name="estado", on_delete=models.PROTECT, null=True, blank=True
    )
    cidade = models.ForeignKey(
        "City", related_name="cidade", on_delete=models.PROTECT, null=True, blank=True
    )
