from django.contrib.auth import get_user_model
from django.db.models import Q

from tarefas.models import Notificacao, NotificacaoTipo

User = get_user_model()


def get_assignment_recipients(tarefa, actor=None):
    recipients = set()
    if tarefa.assigned_to and tarefa.assigned_to != actor:
        recipients.add(tarefa.assigned_to)
    if tarefa.assigned_team:
        for user in tarefa.assigned_team.membros.filter(is_active=True):
            if user != actor:
                recipients.add(user)
    return recipients


def notify_task_assignment(tarefa, actor=None):
    actor_name = getattr(actor, "name", None) or getattr(actor, "username", None) or "Sistema"
    for recipient in get_assignment_recipients(tarefa, actor=actor):
        Notificacao.objects.create(
            user=recipient,
            tarefa=tarefa,
            tipo=NotificacaoTipo.TASK_ASSIGNED,
            titulo="Nova tarefa atribuída",
            mensagem=f'{actor_name} atribuiu a tarefa "{tarefa.titulo}" para você.',
        )


def notify_task_completed(tarefa, completed_by):
    completed_name = (
        getattr(completed_by, "name", None)
        or getattr(completed_by, "username", None)
        or "Um funcionário"
    )
    recipients = set()

    if tarefa.user_id and tarefa.user_id != completed_by.id:
        recipients.add(tarefa.user)

    for user in User.objects.filter(is_active=True).filter(
        Q(role="ADMIN") | Q(role="MANAGER")
    ):
        if user.id != completed_by.id:
            recipients.add(user)

    empresa = getattr(tarefa, "empresa", None)
    if empresa:
        from corporativo.models import UserEmpresa

        empresa_user_ids = set(
            UserEmpresa.objects.filter(empresa=empresa, ativo=True).values_list("user_id", flat=True)
        )
        recipients = {
            user
            for user in recipients
            if user.id in empresa_user_ids or getattr(user, "empresa_id", None) == empresa.id
        }

    for recipient in recipients:
        Notificacao.objects.create(
            user=recipient,
            tarefa=tarefa,
            tipo=NotificacaoTipo.TASK_COMPLETED,
            titulo="Tarefa concluída",
            mensagem=f'{completed_name} concluiu a tarefa "{tarefa.titulo}".',
        )


def assignment_changed(before, after):
    return (
        before.get("assigned_to") != after.get("assigned_to")
        or before.get("assigned_team") != after.get("assigned_team")
    )
