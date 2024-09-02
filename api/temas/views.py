from django.shortcuts import render
from rest_framework.views import APIView
from .models import Tema
from rest_framework.response import Response
from .serializers import TemaSerializer


class ThemeView(APIView):
    permission_classes = []
    authorization_classes = []

    def get(self, request):
        theme = Tema.objects.filter(ativo=True).first()
        serializer = TemaSerializer(theme)
        return Response(serializer.data)
