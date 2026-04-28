from django.contrib import admin

from corporativo.models import Empresa


@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "cnpj", "ativo")
    search_fields = ("nome", "cnpj")
    list_filter = ("ativo",)

