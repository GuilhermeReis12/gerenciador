from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from corporativo.models import Empresa, Equipe, UserEmpresa
from corporativo.serializers import (
    EmpresaSerializer,
    EquipeLookupSerializer,
    EquipeSerializer,
    UserEmpresaSerializer,
)
from utils.empresa_context import get_active_empresa_id, get_user_empresa_ids, user_has_empresa_access
from utils.pagination import BasePagination


class EmpresaViewSet(ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EmpresaSerializer
    queryset = Empresa.objects.filter(ativo=True)

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_superuser or getattr(self.request.user, "role", "") == "ADMIN":
            return queryset
        empresa_ids = get_user_empresa_ids(self.request.user)
        if empresa_ids:
            return queryset.filter(id__in=empresa_ids)
        return queryset.none()

    @action(methods=["get"], detail=False)
    def minhas(self, request):
        empresa_ids = get_user_empresa_ids(request.user)
        queryset = self.get_queryset().filter(id__in=empresa_ids) if empresa_ids else self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "empresas": serializer.data,
                "active_empresa_id": get_active_empresa_id(request),
            }
        )

    @action(methods=["get"], detail=False)
    def minha_empresa(self, request):
        empresa_id = get_active_empresa_id(request)
        if not empresa_id:
            return Response({"detail": "Usuário sem empresa associada."}, status=404)
        empresa = Empresa.objects.filter(id=empresa_id, ativo=True).first()
        if not empresa:
            return Response({"detail": "Empresa não encontrada."}, status=404)
        return Response(EmpresaSerializer(empresa).data)


class EquipeViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EquipeSerializer
    pagination_class = BasePagination

    def get_queryset(self):
        queryset = Equipe.objects.filter(ativo=True).select_related("empresa").prefetch_related("membros")
        empresa_id = get_active_empresa_id(self.request)
        if empresa_id:
            return queryset.filter(empresa_id=empresa_id)
        return queryset.none()

    def perform_create(self, serializer):
        empresa_id = get_active_empresa_id(self.request)
        if not empresa_id:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"empresa": "Selecione uma empresa ativa antes de criar equipes."})
        serializer.save(empresa_id=empresa_id)

    @action(methods=["get"], detail=False)
    def lookup(self, request):
        queryset = self.get_queryset().order_by("nome")
        serializer = EquipeLookupSerializer(queryset, many=True)
        return Response(serializer.data)


class UserEmpresaViewSet(ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserEmpresaSerializer

    def get_queryset(self):
        return UserEmpresa.objects.filter(user=self.request.user, ativo=True).select_related("empresa")

    @action(methods=["post"], detail=False)
    def set_default(self, request):
        empresa_id = request.data.get("empresa_id")
        if not empresa_id or not user_has_empresa_access(request.user, empresa_id):
            return Response({"detail": "Empresa inválida."}, status=status.HTTP_400_BAD_REQUEST)

        UserEmpresa.objects.filter(user=request.user).update(is_default=False)
        membership, _ = UserEmpresa.objects.get_or_create(
            user=request.user,
            empresa_id=empresa_id,
            defaults={"ativo": True, "is_default": True},
        )
        membership.is_default = True
        membership.ativo = True
        membership.save(update_fields=["is_default", "ativo", "updated_at"])

        user = request.user
        user.empresa_id = empresa_id
        user.save(update_fields=["empresa"])

        return Response({"active_empresa_id": empresa_id})
