from django.contrib import admin
from django.urls import include, path
from django.conf import settings

# Alterar nome do django no titulo
# admin.site.site_header = settings.ADMIN_CONFIG["SITE_HEADER"]


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('login.urls')),
    path("temas/", include("temas.urls")),
]