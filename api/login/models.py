from django.db import models
from django.contrib.auth.models import AbstractUser
from person.models import Person
from corporativo.models import Empresa


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrador"
        MANAGER = "MANAGER", "Gestor"
        OPERATOR = "OPERATOR", "Operador"
        VIEWER = "VIEWER", "Leitor"

    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False, verbose_name="Admin")
    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.OPERATOR, verbose_name="Perfil"
    )
    empresa = models.ForeignKey(
        Empresa, on_delete=models.PROTECT, null=True, blank=True, related_name="usuarios"
    )
    user_image = models.CharField(max_length=2000)
    person = models.ForeignKey(
        Person, on_delete=models.PROTECT, null=True, blank=True, verbose_name="person"
    )

    def __str__(self):
        return self.username

    class Meta:
        verbose_name_plural = r"Usuario"

    def set_password(self, raw_password):
        try:
            super().set_password(raw_password)
        except Exception:
            pass
