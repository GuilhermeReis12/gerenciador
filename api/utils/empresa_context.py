from corporativo.models import UserEmpresa


def user_has_empresa_access(user, empresa_id):
    if not user or not user.is_authenticated or not empresa_id:
        return False
    if user.is_superuser or getattr(user, "role", "") == "ADMIN":
        return True
    if UserEmpresa.objects.filter(user=user, empresa_id=empresa_id, ativo=True).exists():
        return True
    return getattr(user, "empresa_id", None) == empresa_id


def get_user_empresa_ids(user):
    if not user or not user.is_authenticated:
        return []
    ids = set(
        UserEmpresa.objects.filter(user=user, ativo=True, empresa__ativo=True).values_list(
            "empresa_id", flat=True
        )
    )
    if getattr(user, "empresa_id", None):
        ids.add(user.empresa_id)
    return list(ids)


def get_default_empresa_id(user):
    if not user or not user.is_authenticated:
        return None
    default = UserEmpresa.objects.filter(user=user, ativo=True, is_default=True).first()
    if default:
        return default.empresa_id
    membership = UserEmpresa.objects.filter(user=user, ativo=True).first()
    if membership:
        return membership.empresa_id
    return getattr(user, "empresa_id", None)


def get_active_empresa_id(request):
    header_value = request.headers.get("X-Empresa-Id") or request.META.get("HTTP_X_EMPRESA_ID")
    if header_value:
        try:
            empresa_id = int(header_value)
            if user_has_empresa_access(request.user, empresa_id):
                return empresa_id
        except (TypeError, ValueError):
            pass
    return get_default_empresa_id(request.user)


def filter_queryset_by_active_empresa(queryset, request, field_name="empresa_id"):
    empresa_id = get_active_empresa_id(request)
    if empresa_id:
        return queryset.filter(**{field_name: empresa_id})
    return queryset.none()
