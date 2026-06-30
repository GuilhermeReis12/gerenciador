import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("tarefas", "0004_merge_20260428_0759"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tarefa",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tarefas_criadas",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="tarefa",
            name="assigned_group",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="tarefas_atribuidas",
                to="auth.group",
            ),
        ),
        migrations.AddField(
            model_name="tarefa",
            name="assigned_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="tarefas_atribuidas",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="tarefaauditlog",
            name="action",
            field=models.CharField(
                choices=[
                    ("CREATED", "Criada"),
                    ("UPDATED", "Atualizada"),
                    ("DELETED", "Excluída"),
                    ("STATUS_CHANGED", "Status alterado"),
                    ("ARCHIVED", "Arquivada"),
                    ("RESTORED", "Desarquivada"),
                    ("BULK_UPDATED", "Atualização em lote"),
                    ("ASSIGNED", "Atribuída"),
                ],
                max_length=30,
            ),
        ),
        migrations.CreateModel(
            name="Notificacao",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "tipo",
                    models.CharField(
                        choices=[
                            ("TASK_ASSIGNED", "Tarefa atribuída"),
                            ("TASK_UPDATED", "Tarefa atualizada"),
                        ],
                        max_length=30,
                    ),
                ),
                ("titulo", models.CharField(max_length=255)),
                ("mensagem", models.TextField()),
                ("lida", models.BooleanField(default=False)),
                (
                    "tarefa",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="notificacoes",
                        to="tarefas.tarefa",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="notificacoes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Notificação",
                "verbose_name_plural": "Notificações",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="notificacao",
            index=models.Index(fields=["user", "lida"], name="tarefas_not_user_id_6f0a8a_idx"),
        ),
        migrations.AddIndex(
            model_name="notificacao",
            index=models.Index(fields=["user", "created_at"], name="tarefas_not_user_id_2f3b1c_idx"),
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["assigned_to", "status"], name="tarefas_tar_assigne_91c2ab_idx"),
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["assigned_group", "status"], name="tarefas_tar_assigne_4d8e12_idx"),
        ),
    ]
