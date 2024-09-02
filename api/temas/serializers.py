from rest_framework import serializers
from temas.models import Tema
from utils.serializers import JsonField


class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = ["tema"]

    tema = JsonField()
