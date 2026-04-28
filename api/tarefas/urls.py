from django.urls import include, path
from rest_framework import routers

from tarefas.views import TarefaViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register("tarefas", TarefaViewSet, basename="tarefas")

urlpatterns = [
    path("", include(router.urls)),
]

