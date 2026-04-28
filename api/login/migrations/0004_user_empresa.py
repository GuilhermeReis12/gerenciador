from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("corporativo", "0001_initial"),
        ("login", "0003_user_role"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="empresa",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="usuarios",
                to="corporativo.empresa",
            ),
        ),
    ]

