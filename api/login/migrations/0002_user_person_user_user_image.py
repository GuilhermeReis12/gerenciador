# Generated by Django 5.0.6 on 2024-06-12 20:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0001_initial'),
        ('person', '0003_alter_person_data_nascimento'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='person',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='person.person', verbose_name='person'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_image',
            field=models.CharField(default=1, max_length=2000),
            preserve_default=False,
        ),
    ]