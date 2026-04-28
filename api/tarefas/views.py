from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from tarefas.filters import TarefaFilter
from tarefas.models import Tarefa, TarefaStatus
from tarefas.serializers import TarefaSerializer, TarefaUpdateSerializer
from utils.pagination import BasePagination


class TarefaViewSet(ModelViewSet):
    serializer_class = TarefaSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = BasePagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TarefaFilter

    def get_queryset(self):
        queryset = Tarefa.objects.filter(user=self.request.user)
        ordering = self.request.query_params.get("ordering", "-created_at")
        allowed_ordering = {
            "created_at",
            "-created_at",
            "updated_at",
            "-updated_at",
            "data_limite",
            "-data_limite",
            "prioridade",
            "-prioridade",
            "status",
            "-status",
            "titulo",
            "-titulo",
        }
        if ordering not in allowed_ordering:
            ordering = "-created_at"
        return queryset.order_by(ordering)

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return TarefaUpdateSerializer
        return TarefaSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.instance
        new_status = serializer.validated_data.get("status", instance.status)

        tarefa = serializer.save()
        if new_status == TarefaStatus.DONE and not tarefa.concluida_em:
            tarefa.concluida_em = timezone.now()
            tarefa.save(update_fields=["concluida_em"])
        if new_status != TarefaStatus.DONE and tarefa.concluida_em:
            tarefa.concluida_em = None
            tarefa.save(update_fields=["concluida_em"])

    @action(methods=["post"], detail=True)
    def concluir(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.marcar_concluida()
        tarefa.save(update_fields=["status", "concluida_em", "updated_at"])
        return Response(TarefaSerializer(tarefa).data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True)
    def reabrir(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.marcar_aberta()
        tarefa.save(update_fields=["status", "concluida_em", "updated_at"])
        return Response(TarefaSerializer(tarefa).data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True)
    def arquivar(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.arquivada = True
        tarefa.save(update_fields=["arquivada", "updated_at"])
        return Response(TarefaSerializer(tarefa).data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True)
    def desarquivar(self, request, pk=None):
        tarefa = self.get_object()
        tarefa.arquivada = False
        tarefa.save(update_fields=["arquivada", "updated_at"])
        return Response(TarefaSerializer(tarefa).data, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False)
    def metrics(self, request):
        queryset = Tarefa.objects.filter(user=request.user)
        today = timezone.localdate()
        total = queryset.count()
        open_tasks = queryset.filter(arquivada=False).exclude(status=TarefaStatus.DONE).count()
        done = queryset.filter(status=TarefaStatus.DONE).count()
        overdue = queryset.filter(
            arquivada=False,
            data_limite__lt=today,
        ).exclude(status=TarefaStatus.DONE).count()
        archived = queryset.filter(arquivada=True).count()
        by_status = list(
            queryset.values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )
        by_priority = list(
            queryset.values("prioridade")
            .annotate(total=Count("id"))
            .order_by("prioridade")
        )
        urgent = queryset.filter(
            Q(prioridade="HIGH") | Q(data_limite__lte=today + timedelta(days=3)),
            arquivada=False,
        ).exclude(status=TarefaStatus.DONE).count()

        return Response(
            {
                "total": total,
                "open": open_tasks,
                "done": done,
                "overdue": overdue,
                "archived": archived,
                "urgent": urgent,
                "by_status": by_status,
                "by_priority": by_priority,
            },
            status=status.HTTP_200_OK,
        )

    @action(methods=["post"], detail=False)
    def bulk_update(self, request):
        ids = request.data.get("ids", [])
        updates = request.data.get("updates", {})

        if not isinstance(ids, list) or not ids:
            return Response(
                {"detail": "Informe uma lista de IDs para atualização em lote."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        allowed_update_keys = {"status", "prioridade", "arquivada"}
        if not isinstance(updates, dict) or not updates:
            return Response(
                {"detail": "Informe os campos de atualização em lote."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not set(updates.keys()).issubset(allowed_update_keys):
            return Response(
                {"detail": "Campos inválidos para atualização em lote."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = Tarefa.objects.filter(user=request.user, id__in=ids)
        updated = 0
        for tarefa in queryset:
            for key, value in updates.items():
                setattr(tarefa, key, value)
            if updates.get("status") == TarefaStatus.DONE:
                tarefa.concluida_em = timezone.now()
            elif "status" in updates and updates.get("status") != TarefaStatus.DONE:
                tarefa.concluida_em = None
            tarefa.save()
            updated += 1

        return Response({"updated": updated}, status=status.HTTP_200_OK)

