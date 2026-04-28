from django.contrib import admin

from operacoes.models import RegistroOperacional


@admin.register(RegistroOperacional)
class RegistroOperacionalAdmin(admin.ModelAdmin):
    list_display = ("id", "empresa", "tipo", "titulo", "sku", "quantidade", "unidade", "ativo")
    list_filter = ("tipo", "ativo", "empresa")
    search_fields = ("titulo", "descricao", "sku", "empresa__nome")

