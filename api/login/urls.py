from django.urls import path
from rest_framework import routers
from rest_framework_jwt.views import ObtainJSONWebToken
from login.serializers import AuthSerializer
from login import views


router = routers.SimpleRouter(trailing_slash=False)
router.register("me", views.MeView)
router.register("users", views.UserView, basename="users")

urlpatterns = [
    path('login', ObtainJSONWebToken.as_view(serializer_class=AuthSerializer)),
    path("user-create", views.UserView.as_view({"post": "create"})),
    path("validate_password", views.PasswordView.as_view()),
]