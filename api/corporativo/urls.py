from django.urls import include, path
from rest_framework import routers

from corporativo.views import EmpresaViewSet, EquipeViewSet, UserEmpresaViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register("empresas", EmpresaViewSet, basename="empresas")
router.register("equipes", EquipeViewSet, basename="equipes")
router.register("user-empresas", UserEmpresaViewSet, basename="user-empresas")

urlpatterns = [path("", include(router.urls))]
