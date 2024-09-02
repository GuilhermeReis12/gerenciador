from django.db import models
from django.contrib.auth.models import AbstractUser
from person.models import Person


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_admin = models.BooleanField(default=False, verbose_name="Admin")
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
