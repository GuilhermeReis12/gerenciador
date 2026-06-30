from django.contrib import admin

from corporativo.models import Empresa, Equipe, UserEmpresa


@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "cnpj", "ativo")
    search_fields = ("nome", "cnpj")
    list_filter = ("ativo",)


@admin.register(UserEmpresa)
class UserEmpresaAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "empresa", "is_default", "ativo")
    list_filter = ("is_default", "ativo", "empresa")
    search_fields = ("user__username", "user__email", "empresa__nome")


@admin.register(Equipe)
class EquipeAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "empresa", "ativo")
    list_filter = ("ativo", "empresa")
    search_fields = ("nome", "empresa__nome")
    filter_horizontal = ("membros",)

