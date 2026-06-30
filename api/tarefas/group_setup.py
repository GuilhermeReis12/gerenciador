DEFAULT_GROUPS = {
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


def setup_default_groups(Group, GroupPermission):
    """Create default groups and their task permissions (idempotent)."""
    for name, permissions in DEFAULT_GROUPS.items():
        group, _ = Group.objects.get_or_create(name=name)
        GroupPermission.objects.update_or_create(group=group, defaults=permissions)


def setup_default_groups_from_apps(apps, schema_editor=None):
    """Entry point for Django migrations."""
    Group = apps.get_model("auth", "Group")
    GroupPermission = apps.get_model("tarefas", "GroupPermission")
    setup_default_groups(Group, GroupPermission)


def setup_default_groups_live():
    """Entry point for management commands and runtime usage."""
    from django.contrib.auth.models import Group

    from tarefas.models import GroupPermission

    setup_default_groups(Group, GroupPermission)
