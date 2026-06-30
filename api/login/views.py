from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import permissions
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
            user = User.objects.filter(pk=pk).first()
            if not user:
                return Response({"detail": "Usuário não encontrado."}, status=404)

            if request.user.id != user.id and getattr(request.user, "role", "OPERATOR") not in {
                "ADMIN",
                "MANAGER",
            }:
                return Response(
                    {"detail": "Você não possui permissão para editar este perfil."},
                    status=403,
                )

            if "username" in request.data:
                user.username = request.data["username"]
            if "email" in request.data:
                user.email = request.data["email"]
            if "name" in request.data:
                user.name = request.data["name"]
            if "user_image" in request.data:
                user.user_image = request.data["user_image"]
            if "role" in request.data:
                user.role = request.data["role"]
            if "empresa" in request.data:
                user.empresa_id = request.data["empresa"]

            password = request.data.get("password") or request.data.get("confirm_password")
            if password:
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
    permission_classes = [permissions.IsAuthenticated]

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
