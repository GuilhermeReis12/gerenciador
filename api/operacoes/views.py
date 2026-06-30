from django.db.models import Q
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from operacoes.models import RegistroOperacional
from operacoes.serializers import RegistroOperacionalSerializer
from utils.pagination import BasePagination


class RegistroOperacionalViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegistroOperacionalSerializer
    pagination_class = BasePagination

    def get_queryset(self):
        empresa = getattr(self.request.user, "empresa", None)
        queryset = RegistroOperacional.objects.all()
        if empresa:
            queryset = queryset.filter(empresa=empresa)
        else:
            queryset = queryset.filter(created_by=self.request.user)
        tipo = self.request.query_params.get("tipo")
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        q = self.request.query_params.get("q")
        if q:
            queryset = queryset.filter(
                Q(titulo__icontains=q) | Q(descricao__icontains=q) | Q(sku__icontains=q)
            )
        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

