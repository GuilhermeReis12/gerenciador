from django.db import migrations


def create_extra_permission_groups(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    GroupPermission = apps.get_model("tarefas", "GroupPermission")

    groups = {
        "Diretor": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": True,
        },
        "Supervisor": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": False,
            "can_manage_permissions": False,
        },
        "Coordenador": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": False,
            "can_manage_permissions": False,
        },
        "Visualizador": {
            "can_create_tasks": False,
            "can_assign_tasks": False,
            "can_view_all_tasks": True,
            "can_manage_team": False,
            "can_complete_assigned": False,
            "can_archive_tasks": False,
            "can_delete_tasks": False,
            "can_manage_permissions": False,
        },
    }

    for name, permissions in groups.items():
        group, _ = Group.objects.get_or_create(name=name)
        GroupPermission.objects.update_or_create(group=group, defaults=permissions)


class Migration(migrations.Migration):

    dependencies = [
        ("tarefas", "0009_teams_link_empresa"),
    ]

    operations = [
        migrations.RunPython(create_extra_permission_groups, migrations.RunPython.noop),
    ]
