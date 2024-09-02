from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from login import models
from login import serializers
from login.models import User
from login.serializers import UserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework.views import APIView
from . import filters


class UserView(ModelViewSet):
    permission_classes = []
    authorization_classes = []
    queryset = models.User.objects.all()
    serializer_class = serializers.UserForm
    filterset_class = filters.UserFilter
    filter_backends = [DjangoFilterBackend]
    search_fields = ["__all__"]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.UserForm
        if self.request.method in ["PUT", "PATCH"]:
            return serializers.UpdateUserSerializer
        return serializers.MeSerializer


    @action(methods=["patch"], detail=True)
    def update_user(self, request, pk):
        try:
            password = request.data["password"]
            user = User.objects.filter(pk=pk).first()

            user.username = request.data["username"]
            user.email = request.data["email"]
            user.name = request.data["name"]
            user.user_image = request.data["user_image"]

            user.set_password(password)
            user.save()
            return Response(status=200, data="Usuário atualizado com sucesso!")
        except Exception as err:
            return Response(status=400, data=str(err))

    def perform_create(self, request):
        password = request.data["password"]
        user, _ = User.objects.get_or_create(
            username=request.data["username"],
            email=request.data["email"],
            name=request.data["first_name"],
        )
        user.set_password(password)
        user.save()


class MeView(GenericViewSet, ListModelMixin):
    serializer_class = serializers.MeSerializer
    queryset = models.User.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(pk=self.request.user.pk)


class PasswordView(APIView):
    permission_classes = []
    authorization_classes = []

    def post(self, request):
        serializer = serializers.CriarSenhaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(dict(detail="Senha criada com sucesso."))
