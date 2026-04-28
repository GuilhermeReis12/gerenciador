from django.urls import include, path
from rest_framework import routers

from corporativo.views import EmpresaViewSet

router = routers.SimpleRouter(trailing_slash=False)
router.register("empresas", EmpresaViewSet, basename="empresas")

urlpatterns = [path("", include(router.urls))]

