from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("corporativo", "0001_initial"),
        ("tarefas", "0002_tarefaauditlog"),
    ]

    operations = [
        migrations.AddField(
            model_name="tarefa",
            name="empresa",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="tarefas",
                to="corporativo.empresa",
            ),
        ),
    ]

