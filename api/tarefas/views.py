from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from api.utils.permissions import IsManagerOrAdmin, IsTaskWriteAllowed
from tarefas.filters import TarefaFilter
from tarefas.models import AuditAction, GroupPermission, Notificacao, Tarefa, TarefaAuditLog, TarefaStatus
from tarefas.permissions_service import (
    can_user_complete_task,
    can_user_edit_task,
    get_assigned_tasks_queryset,
    get_team_tasks_queryset,
    get_user_capabilities,
    get_user_tarefas_queryset,
)
from tarefas.serializers import (
    GroupPermissionSerializer,
    NotificacaoSerializer,
    TarefaAssigneeUpdateSerializer,
    TarefaAuditLogSerializer,
    TarefaSerializer,
    TarefaUpdateSerializer,
    UserCapabilitiesSerializer,
    UserLookupSerializer,
)
from tarefas.services import (
    assignment_changed,
    notify_task_assignment,
    notify_task_completed,
)
from utils.empresa_context import get_active_empresa_id
from utils.pagination import BasePagination


class TarefaViewSet(ModelViewSet):
    serializer_class = TarefaSerializer
    permission_classes = [permissions.IsAuthenticated, IsTaskWriteAllowed]
    pagination_class = BasePagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TarefaFilter

    def get_queryset(self):
        scope = self.request.query_params.get("scope")
        queryset = get_user_tarefas_queryset(self.request.user, scope=scope, request=self.request)
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
        if self.action == "audit_logs":
            return TarefaAuditLogSerializer
        if self.action in ["update", "partial_update"]:
            tarefa = self.get_object()
            if can_user_edit_task(self.request.user, tarefa):
                return TarefaUpdateSerializer
            return TarefaAssigneeUpdateSerializer
        return TarefaSerializer

    def _log_action(self, action, tarefa=None, payload=None):
        log = TarefaAuditLog(user=self.request.user, tarefa=tarefa, action=action)
        log.set_payload(payload)
        log.save()

    def _assignment_snapshot(self, tarefa):
        return {
            "assigned_to": tarefa.assigned_to_id,
            "assigned_team": tarefa.assigned_team_id,
        }

    def perform_create(self, serializer):
        capabilities = get_user_capabilities(self.request.user)
        if not capabilities["can_create_tasks"]:
            raise PermissionDenied("Seu perfil não pode criar tarefas.")

        empresa_id = get_active_empresa_id(self.request)
        if not empresa_id:
            raise ValidationError({"empresa": "Selecione uma empresa ativa antes de criar tarefas."})

        tarefa = serializer.save(
            user=self.request.user,
            empresa_id=empresa_id,
        )
        self._log_action(
            AuditAction.CREATED,
            tarefa=tarefa,
            payload={"titulo": tarefa.titulo, "status": tarefa.status},
        )
        if tarefa.assigned_to_id or tarefa.assigned_team_id:
            self._log_action(
                AuditAction.ASSIGNED,
                tarefa=tarefa,
                payload=self._assignment_snapshot(tarefa),
            )
            notify_task_assignment(tarefa, actor=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.instance
        if not can_user_edit_task(self.request.user, instance):
            allowed = set(serializer.validated_data.keys()) <= {"status", "prioridade"}
            if not allowed or not can_user_complete_task(self.request.user, instance):
                raise PermissionDenied("Você não possui permissão para editar esta tarefa.")

        before = self._assignment_snapshot(instance)
        old_status = instance.status
        new_status = serializer.validated_data.get("status", instance.status)

        tarefa = serializer.save()
        if new_status == TarefaStatus.DONE and not tarefa.concluida_em:
            tarefa.concluida_em = timezone.now()
            tarefa.save(update_fields=["concluida_em"])
        if new_status != TarefaStatus.DONE and tarefa.concluida_em:
            tarefa.concluida_em = None
            tarefa.save(update_fields=["concluida_em"])

        after = self._assignment_snapshot(tarefa)
        self._log_action(
            AuditAction.UPDATED,
            tarefa=tarefa,
            payload=serializer.validated_data,
        )
        if assignment_changed(before, after):
            self._log_action(AuditAction.ASSIGNED, tarefa=tarefa, payload=after)
            notify_task_assignment(tarefa, actor=self.request.user)

        if old_status != TarefaStatus.DONE and new_status == TarefaStatus.DONE:
            notify_task_completed(tarefa, completed_by=self.request.user)

    def perform_destroy(self, instance):
        capabilities = get_user_capabilities(self.request.user)
        if not capabilities["can_delete_tasks"]:
            raise PermissionDenied("Seu perfil não pode excluir tarefas.")
        if instance.user_id != self.request.user.id and not capabilities["can_manage_team"]:
            raise PermissionDenied("Somente o criador ou gestores podem excluir esta tarefa.")

        task_id = instance.id
        task_title = instance.titulo
        self._log_action(
            AuditAction.DELETED,
            tarefa=instance,
            payload={"id": task_id, "titulo": task_title},
        )
        instance.delete()

    def _complete_task(self, request, tarefa):
        if not can_user_complete_task(request.user, tarefa):
            raise PermissionDenied("Você não possui permissão para concluir esta tarefa.")
        was_done = tarefa.status == TarefaStatus.DONE
        tarefa.marcar_concluida()
        tarefa.save(update_fields=["status", "concluida_em", "updated_at"])
        self._log_action(
            AuditAction.STATUS_CHANGED,
            tarefa=tarefa,
            payload={"status": TarefaStatus.DONE},
        )
        if not was_done:
            notify_task_completed(tarefa, completed_by=request.user)
        return Response(TarefaSerializer(tarefa, context={"request": request}).data)

    @action(methods=["post"], detail=True)
    def concluir(self, request, pk=None):
        return self._complete_task(request, self.get_object())

    @action(methods=["post"], detail=True)
    def reabrir(self, request, pk=None):
        tarefa = self.get_object()
        if not can_user_complete_task(request.user, tarefa):
            raise PermissionDenied("Você não possui permissão para reabrir esta tarefa.")
        tarefa.marcar_aberta()
        tarefa.save(update_fields=["status", "concluida_em", "updated_at"])
        self._log_action(
            AuditAction.STATUS_CHANGED,
            tarefa=tarefa,
            payload={"status": tarefa.status},
        )
        return Response(TarefaSerializer(tarefa, context={"request": request}).data)

    @action(methods=["post"], detail=True)
    def em_andamento(self, request, pk=None):
        tarefa = self.get_object()
        if not can_user_complete_task(request.user, tarefa):
            raise PermissionDenied("Você não possui permissão para atualizar esta tarefa.")
        tarefa.status = TarefaStatus.IN_PROGRESS
        tarefa.save(update_fields=["status", "updated_at"])
        self._log_action(
            AuditAction.STATUS_CHANGED,
            tarefa=tarefa,
            payload={"status": TarefaStatus.IN_PROGRESS},
        )
        return Response(TarefaSerializer(tarefa, context={"request": request}).data)

    @action(methods=["post"], detail=True)
    def arquivar(self, request, pk=None):
        capabilities = get_user_capabilities(request.user)
        if not capabilities["can_archive_tasks"]:
            raise PermissionDenied("Seu perfil não pode arquivar tarefas.")
        tarefa = self.get_object()
        tarefa.arquivada = True
        tarefa.save(update_fields=["arquivada", "updated_at"])
        self._log_action(AuditAction.ARCHIVED, tarefa=tarefa, payload={"arquivada": True})
        return Response(TarefaSerializer(tarefa, context={"request": request}).data)

    @action(methods=["post"], detail=True)
    def desarquivar(self, request, pk=None):
        capabilities = get_user_capabilities(request.user)
        if not capabilities["can_archive_tasks"]:
            raise PermissionDenied("Seu perfil não pode desarquivar tarefas.")
        tarefa = self.get_object()
        tarefa.arquivada = False
        tarefa.save(update_fields=["arquivada", "updated_at"])
        self._log_action(AuditAction.RESTORED, tarefa=tarefa, payload={"arquivada": False})
        return Response(TarefaSerializer(tarefa, context={"request": request}).data)

    @action(methods=["get"], detail=False)
    def my_capabilities(self, request):
        capabilities = get_user_capabilities(request.user)
        payload = {
            "role": getattr(request.user, "role", "OPERATOR"),
            "groups": list(request.user.groups.values_list("name", flat=True)),
            "active_empresa_id": get_active_empresa_id(request),
            **capabilities,
        }
        if "can_manage_equipes" not in payload:
            payload["can_manage_equipes"] = capabilities.get("can_manage_team", False)
        return Response(UserCapabilitiesSerializer(payload).data)

    @action(methods=["get"], detail=False)
    def assigned_to_me(self, request):
        queryset = get_assigned_tasks_queryset(request.user, request=request).order_by("data_limite", "-created_at")
        queryset = TarefaFilter(request.GET, queryset=queryset).qs
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = TarefaSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)

    @action(methods=["get"], detail=False)
    def team(self, request):
        capabilities = get_user_capabilities(request.user)
        if not capabilities["can_manage_team"]:
            raise PermissionDenied("Acesso restrito à gestão de equipe.")
        queryset = get_team_tasks_queryset(request.user, request=request).order_by("-created_at")
        queryset = TarefaFilter(request.GET, queryset=queryset).qs
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = TarefaSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)

    @action(methods=["get"], detail=False)
    def metrics(self, request):
        scope = request.query_params.get("scope")
        if scope == "assigned":
            queryset = get_assigned_tasks_queryset(request.user, request=request)
        elif scope == "team":
            queryset = get_team_tasks_queryset(request.user, request=request)
        else:
            queryset = get_user_tarefas_queryset(request.user, request=request)

        today = timezone.localdate()
        total = queryset.count()
        open_tasks = queryset.filter(arquivada=False).exclude(status=TarefaStatus.DONE).count()
        done = queryset.filter(status=TarefaStatus.DONE).count()
        overdue = queryset.filter(
            arquivada=False,
            data_limite__lt=today,
        ).exclude(status=TarefaStatus.DONE).count()
        archived = queryset.filter(arquivada=True).count()
        assigned_to_me = get_assigned_tasks_queryset(request.user, request=request).count()
        in_progress = queryset.filter(status=TarefaStatus.IN_PROGRESS, arquivada=False).count()
        by_status = list(queryset.values("status").annotate(total=Count("id")).order_by("status"))
        by_priority = list(
            queryset.values("prioridade").annotate(total=Count("id")).order_by("prioridade")
        )
        by_assignee = list(
            queryset.exclude(assigned_to__isnull=True)
            .values("assigned_to__name", "assigned_to__username", "status")
            .annotate(total=Count("id"))
            .order_by("assigned_to__name")
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
                "assigned_to_me": assigned_to_me,
                "in_progress": in_progress,
                "by_status": by_status,
                "by_priority": by_priority,
                "by_assignee": by_assignee,
            },
            status=status.HTTP_200_OK,
        )

    @action(methods=["post"], detail=False)
    def bulk_update(self, request):
        capabilities = get_user_capabilities(request.user)
        if not capabilities["can_manage_team"]:
            raise PermissionDenied("Seu perfil não pode atualizar tarefas em lote.")

        ids = request.data.get("ids", [])
        updates = request.data.get("updates", {})

        if not isinstance(ids, list) or not ids:
            raise ValidationError({"detail": "Informe uma lista de IDs para atualização em lote."})
        allowed_update_keys = {"status", "prioridade", "arquivada"}
        if not isinstance(updates, dict) or not updates:
            raise ValidationError({"detail": "Informe os campos de atualização em lote."})
        if not set(updates.keys()).issubset(allowed_update_keys):
            raise ValidationError({"detail": "Campos inválidos para atualização em lote."})

        queryset = get_team_tasks_queryset(request.user, request=request).filter(id__in=ids)
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

        self._log_action(
            AuditAction.BULK_UPDATED,
            payload={"ids": ids, "updates": updates, "updated": updated},
        )
        return Response({"updated": updated}, status=status.HTTP_200_OK)

    @action(
        methods=["get"],
        detail=False,
        permission_classes=[permissions.IsAuthenticated, IsManagerOrAdmin],
    )
    def audit_logs(self, request):
        queryset = TarefaAuditLog.objects.select_related("user", "tarefa").all()
        empresa = getattr(request.user, "empresa", None)
        if empresa:
            queryset = queryset.filter(Q(tarefa__empresa=empresa) | Q(tarefa__isnull=True))
        action_filter = request.query_params.get("action")
        if action_filter:
            queryset = queryset.filter(action=action_filter)
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = self.get_serializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(methods=["get"], detail=False)
    def assignable_users(self, request):
        from corporativo.models import UserEmpresa

        User = get_user_model()
        empresa_id = get_active_empresa_id(request)
        if not empresa_id:
            return Response([])

        user_ids = set(
            UserEmpresa.objects.filter(empresa_id=empresa_id, ativo=True).values_list("user_id", flat=True)
        )
        user_ids.update(
            User.objects.filter(empresa_id=empresa_id, is_active=True).values_list("id", flat=True)
        )
        queryset = User.objects.filter(id__in=user_ids, is_active=True).order_by("name", "username")
        serializer = UserLookupSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=["get"], detail=False)
    def assignable_teams(self, request):
        from corporativo.models import Equipe

        empresa_id = get_active_empresa_id(request)
        if not empresa_id:
            return Response([])
        queryset = Equipe.objects.filter(empresa_id=empresa_id, ativo=True).order_by("nome")
        from corporativo.serializers import EquipeLookupSerializer

        serializer = EquipeLookupSerializer(queryset, many=True)
        return Response(serializer.data)


class GroupPermissionViewSet(ModelViewSet):
    serializer_class = GroupPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = GroupPermission.objects.select_related("group").all()
    pagination_class = BasePagination

    def get_queryset(self):
        capabilities = get_user_capabilities(self.request.user)
        if not capabilities["can_manage_permissions"]:
            return GroupPermission.objects.none()
        return super().get_queryset()

    def perform_create(self, serializer):
        capabilities = get_user_capabilities(self.request.user)
        if not capabilities["can_manage_permissions"]:
            raise PermissionDenied("Acesso restrito para gerenciar permissões.")
        serializer.save()

    def perform_update(self, serializer):
        capabilities = get_user_capabilities(self.request.user)
        if not capabilities["can_manage_permissions"]:
            raise PermissionDenied("Acesso restrito para gerenciar permissões.")
        serializer.save()


class NotificacaoViewSet(ReadOnlyModelViewSet):
    serializer_class = NotificacaoSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = BasePagination
    http_method_names = ["get", "head", "options", "patch"]

    def get_queryset(self):
        return Notificacao.objects.filter(user=self.request.user).select_related("tarefa")

    def partial_update(self, request, *args, **kwargs):
        notificacao = self.get_object()
        if "lida" in request.data:
            notificacao.lida = bool(request.data["lida"])
            notificacao.save(update_fields=["lida", "updated_at"])
        serializer = self.get_serializer(notificacao)
        return Response(serializer.data)

    @action(methods=["post"], detail=False)
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(lida=False).update(lida=True)
        return Response({"updated": updated})

    @action(methods=["get"], detail=False)
    def unread_count(self, request):
        count = self.get_queryset().filter(lida=False).count()
        return Response({"count": count})
