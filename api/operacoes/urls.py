from django.urls import include, path
from rest_framework import routers

from operacoes.views import RegistroOperacionalViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register("operacoes", RegistroOperacionalViewSet, basename="operacoes")

urlpatterns = [path("", include(router.urls))]

