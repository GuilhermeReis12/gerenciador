from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsManagerOrAdmin(BasePermission):
    """Allow access only to ADMIN and MANAGER roles."""

    message = "Acesso restrito para gestores e administradores."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, "role", "OPERATOR") in {"ADMIN", "MANAGER"}


class IsTaskWriteAllowed(BasePermission):
    """
    Regras RBAC mínimas para operações de tarefas.
    - VIEWER: somente leitura
    - OPERATOR: leitura e escrita básica
    - MANAGER/ADMIN: todas as operações
    """

    message = "Você não possui permissão para executar esta ação."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        role = getattr(user, "role", "OPERATOR")
        if request.method in SAFE_METHODS:
            return True

        if role == "VIEWER":
            return False

        manager_actions = {
            "bulk_update",
            "audit_logs",
            "destroy",
            "arquivar",
            "desarquivar",
        }
        if view.action in manager_actions and role not in {"ADMIN", "MANAGER"}:
            return False

        return True

