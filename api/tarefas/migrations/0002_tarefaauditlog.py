from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("tarefas", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="TarefaAuditLog",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "action",
                    models.CharField(
                        choices=[
                            ("CREATED", "Criada"),
                            ("UPDATED", "Atualizada"),
                            ("DELETED", "Excluída"),
                            ("STATUS_CHANGED", "Status alterado"),
                            ("ARCHIVED", "Arquivada"),
                            ("RESTORED", "Desarquivada"),
                            ("BULK_UPDATED", "Atualização em lote"),
                        ],
                        max_length=30,
                    ),
                ),
                ("payload", models.TextField(blank=True, null=True)),
                (
                    "tarefa",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to="tarefas.tarefa",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Log de Tarefa",
                "verbose_name_plural": "Logs de Tarefas",
                "ordering": ["-created_at"],
            },
        ),
    ]

