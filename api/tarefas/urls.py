from django.urls import include, path
from rest_framework import routers

from tarefas.views import GroupPermissionViewSet, NotificacaoViewSet, TarefaViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register("tarefas", TarefaViewSet, basename="tarefas")
router.register("notificacoes", NotificacaoViewSet, basename="notificacoes")
router.register("group-permissions", GroupPermissionViewSet, basename="group-permissions")

urlpatterns = [
    path("", include(router.urls)),
]

