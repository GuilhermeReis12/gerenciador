import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def seed_user_empresa_from_user_fk(apps, schema_editor):
    User = apps.get_model("login", "User")
    UserEmpresa = apps.get_model("corporativo", "UserEmpresa")
    for user in User.objects.exclude(empresa_id__isnull=True):
        UserEmpresa.objects.get_or_create(
            user_id=user.id,
            empresa_id=user.empresa_id,
            defaults={"is_default": True, "ativo": True},
        )


class Migration(migrations.Migration):

    dependencies = [
        ("corporativo", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="UserEmpresa",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("is_default", models.BooleanField(default=False)),
                ("ativo", models.BooleanField(default=True)),
                (
                    "empresa",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_memberships",
                        to="corporativo.empresa",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="empresa_memberships",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Vínculo Usuário-Empresa",
                "verbose_name_plural": "Vínculos Usuário-Empresa",
                "ordering": ["-is_default", "empresa__nome"],
                "unique_together": {("user", "empresa")},
            },
        ),
        migrations.CreateModel(
            name="Equipe",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("nome", models.CharField(max_length=120)),
                ("descricao", models.TextField(blank=True, null=True)),
                ("ativo", models.BooleanField(default=True)),
                (
                    "empresa",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="equipes",
                        to="corporativo.empresa",
                    ),
                ),
                (
                    "membros",
                    models.ManyToManyField(
                        blank=True,
                        related_name="equipes_operacionais",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Equipe Operacional",
                "verbose_name_plural": "Equipes Operacionais",
                "ordering": ["nome"],
                "unique_together": {("empresa", "nome")},
            },
        ),
        migrations.RunPython(seed_user_empresa_from_user_fk, migrations.RunPython.noop),
    ]
