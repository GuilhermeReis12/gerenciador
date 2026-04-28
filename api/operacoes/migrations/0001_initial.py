from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("corporativo", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="RegistroOperacional",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("tipo", models.CharField(choices=[("TASK", "Tarefa"), ("PRODUCT", "Produto"), ("STOCK", "Estoque")], max_length=20)),
                ("titulo", models.CharField(max_length=255)),
                ("descricao", models.TextField(blank=True, null=True)),
                ("sku", models.CharField(blank=True, max_length=80, null=True)),
                ("quantidade", models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ("unidade", models.CharField(default="UN", max_length=20)),
                ("ativo", models.BooleanField(default=True)),
                (
                    "created_by",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
                ),
                (
                    "empresa",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="registros", to="corporativo.empresa"),
                ),
            ],
            options={
                "verbose_name": "Registro Operacional",
                "verbose_name_plural": "Registros Operacionais",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="registrooperacional",
            index=models.Index(fields=["empresa", "tipo"], name="operacoes_r_empresa_2db04c_idx"),
        ),
        migrations.AddIndex(
            model_name="registrooperacional",
            index=models.Index(fields=["empresa", "sku"], name="operacoes_r_empresa_832520_idx"),
        ),
        migrations.AddIndex(
            model_name="registrooperacional",
            index=models.Index(fields=["empresa", "ativo"], name="operacoes_r_empresa_06eb68_idx"),
        ),
    ]

