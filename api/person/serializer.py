from utils.s3 import generate_presigned_url
from rest_framework import serializers
from .models import Person, State, City


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = [
            "id",
            "name",
            "uf",
        ]


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = [
            "id",
            "name",
            "state",
        ]


class PersonForm(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = [
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
        ]

    nome = serializers.CharField(required=True)
    sobrenome = serializers.CharField(required=True)
    data_nascimento = serializers.DateField(required=True)
    cep = serializers.CharField(required=True)
    logradouro = serializers.CharField(required=True)
    numero = serializers.CharField(required=True)
    bairro = serializers.CharField(required=True)


class PersonSerializer(serializers.ModelSerializer):
    estado = StateSerializer()
    cidade = CitySerializer()

    class Meta:
        model = Person
        fields = [
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
        ]
