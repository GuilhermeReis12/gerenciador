from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("login", "0002_user_person_user_user_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("ADMIN", "Administrador"),
                    ("MANAGER", "Gestor"),
                    ("OPERATOR", "Operador"),
                    ("VIEWER", "Leitor"),
                ],
                default="OPERATOR",
                max_length=20,
                verbose_name="Perfil",
            ),
        ),
    ]

