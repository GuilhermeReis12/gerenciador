from django.db import migrations


def create_default_groups(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    GroupPermission = apps.get_model("tarefas", "GroupPermission")

    default_groups = {
        "Admin": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": True,
        },
        "Gerente": {
            "can_create_tasks": True,
            "can_assign_tasks": True,
            "can_view_all_tasks": True,
            "can_manage_team": True,
            "can_complete_assigned": True,
            "can_archive_tasks": True,
            "can_delete_tasks": True,
            "can_manage_permissions": False,
        },
        "Funcionario": {
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

    for name, permissions in default_groups.items():
        group, _ = Group.objects.get_or_create(name=name)
        GroupPermission.objects.update_or_create(group=group, defaults=permissions)


class Migration(migrations.Migration):

    dependencies = [
        ("tarefas", "0007_group_permissions"),
    ]

    operations = [
        migrations.RunPython(create_default_groups, migrations.RunPython.noop),
    ]
