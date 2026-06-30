from django.db import migrations


class Migration(migrations.Migration):
    """
    SQL Server may not have created indexes with the exact names from 0001_initial.
    Update Django migration state only, without renaming indexes in the database.
    """

    dependencies = [
        ("operacoes", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.RenameIndex(
                    model_name="registrooperacional",
                    new_name="operacoes_r_empresa_e6320a_idx",
                    old_name="operacoes_r_empresa_2db04c_idx",
                ),
                migrations.RenameIndex(
                    model_name="registrooperacional",
                    new_name="operacoes_r_empresa_46fa51_idx",
                    old_name="operacoes_r_empresa_832520_idx",
                ),
                migrations.RenameIndex(
                    model_name="registrooperacional",
                    new_name="operacoes_r_empresa_a83c0b_idx",
                    old_name="operacoes_r_empresa_06eb68_idx",
                ),
            ],
            database_operations=[],
        ),
    ]
