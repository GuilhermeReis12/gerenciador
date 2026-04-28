from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from corporativo.models import Empresa
from corporativo.serializers import EmpresaSerializer


class EmpresaViewSet(ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EmpresaSerializer
    queryset = Empresa.objects.filter(ativo=True)

    @action(methods=["get"], detail=False)
    def minha_empresa(self, request):
        empresa = getattr(request.user, "empresa", None)
        if not empresa:
            return Response({"detail": "Usuário sem empresa associada."}, status=404)
        return Response(EmpresaSerializer(empresa).data)

