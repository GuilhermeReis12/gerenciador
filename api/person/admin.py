from django.contrib import admin
from .models import Person, State, City


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "uf",
    )
    search_fields = ("name",)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "state",
    )
    search_fields = ("name",)


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nome",
        "sobrenome",
        "data_nascimento",
        "cep",
        "logradouro",
        "numero",
        "complemento",
        "bairro",
        "estado",
        "cidade",
    )
    search_fields = ("nome",)
