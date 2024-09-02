from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = (
        "username",
        "email",
        "name",
        "is_staff",
        "is_admin",
        "user_image",
        "person",
    )  # Adicione 'is_admin' à lista de exibição

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Informações Pessoais",
            {"fields": ("name", "email", "is_admin", "user_image", "person")},
        ),
        (
            "Permissões",
            {"fields": ("is_active", "is_staff", "groups", "user_permissions")},
        ),
        ("Datas Importantes", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_admin",
                ),
            },
        ),
    )


admin.site.register(User, UserAdmin)
