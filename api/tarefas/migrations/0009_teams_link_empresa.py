import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("corporativo", "0002_userempresa_equipe"),
        ("tarefas", "0008_create_default_groups"),
    ]

    operations = [
        migrations.AddField(
            model_name="tarefa",
            name="link",
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name="tarefa",
            name="assigned_team",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="tarefas_atribuidas",
                to="corporativo.equipe",
            ),
        ),
        migrations.RemoveIndex(
            model_name="tarefa",
            name="tarefas_tar_assigne_3a6fdb_idx",
        ),
        migrations.RemoveField(
            model_name="tarefa",
            name="assigned_group",
        ),
        migrations.AddIndex(
            model_name="tarefa",
            index=models.Index(fields=["assigned_team", "status"], name="tarefas_tar_assigne_team_idx"),
        ),
    ]
