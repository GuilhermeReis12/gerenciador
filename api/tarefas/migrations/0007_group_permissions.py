import django.db.models.deletion
from django.db import migrations, models


def seed_group_permissions(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    GroupPermission = apps.get_model("tarefas", "GroupPermission")

    defaults_by_name = {
        "admin": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": True,
        },
        "administrador": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": True,
        },
        "gerente": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": False,
        },
        "gestor": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": False,
        },
        "funcionario": {
            "can_create_tasks": False,
            "can_assign_tasks": False,
            "can_view_all_tasks": False,
            "can_manage_team": False,
            "can_complete_assigned": True,
            "can_archive_tasks": False,
            "can_delete_tasks": False,
            "can_manage_permissions": False,
        },
        "funcionário": {
            "can_create_tasks": False,
            "can_assign_tasks": False,
            "can_view_all_tasks": False,
            "can_manage_team": False,
            "can_complete_assigned": True,
            "can_archive_tasks": False,
            "can_delete_tasks": False,
            "can_manage_permissions": False,
        },
    }

    for group in Group.objects.all():
        normalized = group.name.strip().lower()
        defaults = defaults_by_name.get(
            normalized,
            {
                "can_create_tasks": False,
                "can_assign_tasks": False,
                "can_view_all_tasks": False,
                "can_manage_team": False,
                "can_complete_assigned": True,
                "can_archive_tasks": False,
                "can_delete_tasks": False,
                "can_manage_permissions": False,
            },
        )
        GroupPermission.objects.get_or_create(group=group, defaults=defaults)


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("tarefas", "0006_rename_tarefas_not_user_id_6f0a8a_idx_tarefas_not_user_id_0eaafd_idx_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="GroupPermission",
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
                ("can_create_tasks", models.BooleanField(default=False)),
                ("can_assign_tasks", models.BooleanField(default=False)),
                ("can_view_all_tasks", models.BooleanField(default=False)),
                ("can_manage_team", models.BooleanField(default=False)),
                ("can_complete_assigned", models.BooleanField(default=True)),
                ("can_archive_tasks", models.BooleanField(default=False)),
                ("can_delete_tasks", models.BooleanField(default=False)),
                ("can_manage_permissions", models.BooleanField(default=False)),
                (
                    "group",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="task_permissions",
                        to="auth.group",
                    ),
                ),
            ],
            options={
                "verbose_name": "Permissão de Grupo",
                "verbose_name_plural": "Permissões de Grupos",
            },
        ),
        migrations.AlterField(
            model_name="notificacao",
            name="tipo",
            field=models.CharField(
                choices=[
                    ("TASK_ASSIGNED", "Tarefa atribuída"),
                    ("TASK_UPDATED", "Tarefa atualizada"),
                    ("TASK_COMPLETED", "Tarefa concluída"),
                ],
                max_length=30,
            ),
        ),
        migrations.RunPython(seed_group_permissions, migrations.RunPython.noop),
    ]
