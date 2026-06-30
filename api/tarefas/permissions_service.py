from django.db.models import Q

from tarefas.models import GroupPermission, Tarefa
from utils.empresa_context import filter_queryset_by_active_empresa, get_active_empresa_id

DEFAULT_CAPABILITIES = {
    "can_create_tasks": False,
    "can_assign_tasks": False,
    "can_view_all_tasks": False,
    "can_manage_team": False,
    "can_complete_assigned": True,
    "can_archive_tasks": False,
    "can_delete_tasks": False,
    "can_manage_permissions": False,
    "can_manage_equipes": False,
}

ROLE_DEFAULTS = {
    "ADMIN": {
        "can_create_tasks": True,
        "can_assign_tasks": True,
        "can_view_all_tasks": True,
        "can_manage_team": True,
        "can_complete_assigned": True,
        "can_archive_tasks": True,
        "can_delete_tasks": True,
        "can_manage_permissions": True,
        "can_manage_equipes": True,
    },
    "MANAGER": {
        "can_create_tasks": True,
        "can_assign_tasks": True,
        "can_view_all_tasks": True,
        "can_manage_team": True,
        "can_complete_assigned": True,
        "can_archive_tasks": True,
        "can_delete_tasks": True,
        "can_manage_permissions": False,
        "can_manage_equipes": True,
    },
    "OPERATOR": {
        "can_create_tasks": False,
        "can_assign_tasks": False,
        "can_view_all_tasks": False,
        "can_manage_team": False,
        "can_complete_assigned": True,
        "can_archive_tasks": False,
        "can_delete_tasks": False,
        "can_manage_permissions": False,
        "can_manage_equipes": False,
    },
    "VIEWER": {
        "can_create_tasks": False,
        "can_assign_tasks": False,
        "can_view_all_tasks": False,
        "can_manage_team": False,
        "can_complete_assigned": False,
        "can_archive_tasks": False,
        "can_delete_tasks": False,
        "can_manage_permissions": False,
        "can_manage_equipes": False,
    },
}

GROUP_NAME_DEFAULTS = {
    "admin": ROLE_DEFAULTS["ADMIN"],
    "administrador": ROLE_DEFAULTS["ADMIN"],
    "diretor": ROLE_DEFAULTS["ADMIN"],
    "gerente": ROLE_DEFAULTS["MANAGER"],
    "manager": ROLE_DEFAULTS["MANAGER"],
    "gestor": ROLE_DEFAULTS["MANAGER"],
    "supervisor": ROLE_DEFAULTS["MANAGER"],
    "coordenador": ROLE_DEFAULTS["MANAGER"],
    "funcionario": ROLE_DEFAULTS["OPERATOR"],
    "funcionário": ROLE_DEFAULTS["OPERATOR"],
    "employee": ROLE_DEFAULTS["OPERATOR"],
    "operador": ROLE_DEFAULTS["OPERATOR"],
    "visualizador": ROLE_DEFAULTS["VIEWER"],
    "leitor": ROLE_DEFAULTS["VIEWER"],
}


def _merge_capabilities(base, extra):
    merged = dict(base)
    for key, value in extra.items():
        if value:
            merged[key] = True
    return merged


def get_group_capabilities(group):
    try:
        permission = group.task_permissions
    except GroupPermission.DoesNotExist:
        normalized = group.name.strip().lower()
        defaults = GROUP_NAME_DEFAULTS.get(normalized, {})
        return _merge_capabilities(DEFAULT_CAPABILITIES, defaults)

    return {
        "can_create_tasks": permission.can_create_tasks,
        "can_assign_tasks": permission.can_assign_tasks,
        "can_view_all_tasks": permission.can_view_all_tasks,
        "can_manage_team": permission.can_manage_team,
        "can_complete_assigned": permission.can_complete_assigned,
        "can_archive_tasks": permission.can_archive_tasks,
        "can_delete_tasks": permission.can_delete_tasks,
        "can_manage_permissions": permission.can_manage_permissions,
        "can_manage_equipes": permission.can_manage_team,
    }


def get_user_capabilities(user):
    if not user or not user.is_authenticated:
        return dict(DEFAULT_CAPABILITIES)

    if user.is_superuser or getattr(user, "role", "") == "ADMIN":
        return dict(ROLE_DEFAULTS["ADMIN"])

    capabilities = dict(ROLE_DEFAULTS.get(getattr(user, "role", "OPERATOR"), DEFAULT_CAPABILITIES))

    for group in user.groups.all():
        capabilities = _merge_capabilities(capabilities, get_group_capabilities(group))

    return capabilities


def user_is_assigned_to_task(user, tarefa):
    if tarefa.assigned_to_id == user.id:
        return True
    if tarefa.assigned_team_id and tarefa.assigned_team.membros.filter(id=user.id).exists():
        return True
    return False


def can_user_complete_task(user, tarefa):
    capabilities = get_user_capabilities(user)
    if not capabilities["can_complete_assigned"]:
        return False
    if tarefa.user_id == user.id and capabilities["can_create_tasks"]:
        return True
    if user_is_assigned_to_task(user, tarefa):
        return True
    if capabilities["can_manage_team"] or capabilities["can_view_all_tasks"]:
        return True
    return False


def can_user_edit_task(user, tarefa):
    capabilities = get_user_capabilities(user)
    if capabilities["can_manage_team"] or capabilities["can_view_all_tasks"]:
        return True
    if tarefa.user_id == user.id and capabilities["can_create_tasks"]:
        return True
    return False


def _apply_empresa_scope(queryset, request):
    return filter_queryset_by_active_empresa(queryset, request)


def get_assigned_tasks_queryset(user, request=None):
    assigned_q = Q(assigned_to=user)
    if hasattr(user, "equipes_operacionais"):
        assigned_q |= Q(assigned_team__membros=user)
    queryset = Tarefa.objects.filter(assigned_q).exclude(user=user).distinct()
    if request:
        queryset = _apply_empresa_scope(queryset, request)
    return queryset


def get_created_tasks_queryset(user, request=None):
    queryset = Tarefa.objects.filter(user=user)
    if request:
        queryset = _apply_empresa_scope(queryset, request)
    return queryset


def get_team_tasks_queryset(user, request=None):
    capabilities = get_user_capabilities(user)
    if not capabilities["can_manage_team"] and not capabilities["can_view_all_tasks"]:
        return Tarefa.objects.none()

    queryset = Tarefa.objects.all()
    if request:
        queryset = _apply_empresa_scope(queryset, request)
    return queryset.distinct()


def get_user_tarefas_queryset(user, scope=None, request=None):
    if scope == "assigned":
        return get_assigned_tasks_queryset(user, request=request)

    if scope == "created":
        return get_created_tasks_queryset(user, request=request)

    if scope == "team":
        return get_team_tasks_queryset(user, request=request)

    capabilities = get_user_capabilities(user)
    assigned_q = Q(assigned_to=user) | Q(assigned_team__membros=user)

    if capabilities["can_view_all_tasks"] or capabilities["can_manage_team"]:
        queryset = Tarefa.objects.all()
        if request:
            queryset = _apply_empresa_scope(queryset, request)
        return queryset.distinct()

    created_q = Q(user=user)
    queryset = Tarefa.objects.filter(created_q | assigned_q).distinct()
    if request:
        queryset = _apply_empresa_scope(queryset, request)
    return queryset


def get_active_empresa_for_request(request):
    return get_active_empresa_id(request)
