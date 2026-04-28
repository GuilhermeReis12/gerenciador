from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Tarefa",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("titulo", models.CharField(max_length=255)),
                ("descricao", models.TextField(blank=True, null=True)),
                ("status", models.CharField(choices=[("TODO", "A fazer"), ("IN_PROGRESS", "Em andamento"), ("DONE", "Concluída")], default="TODO", max_length=20)),
                ("prioridade", models.CharField(choices=[("LOW", "Baixa"), ("MEDIUM", "Média"), ("HIGH", "Alta")], default="MEDIUM", max_length=10)),
                ("data_limite", models.DateField(blank=True, null=True)),
                ("concluida_em", models.DateTimeField(blank=True, null=True)),
                ("arquivada", models.BooleanField(default=False)),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tarefas", to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={
                "verbose_name": "Tarefa",
                "verbose_name_plural": "Tarefas",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["user", "status"], name="tarefas_tar_user_id_3acb3b_idx"),
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["user", "prioridade"], name="tarefas_tar_user_id_8511b7_idx"),
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["user", "arquivada"], name="tarefas_tar_user_id_72bb0e_idx"),
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["user", "data_limite"], name="tarefas_tar_user_id_7dfd02_idx"),
        ),
    ]

