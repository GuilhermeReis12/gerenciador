from django.core.management.base import BaseCommand

from tarefas.group_setup import DEFAULT_GROUPS, setup_default_groups_live


class Command(BaseCommand):
    help = "Create default auth groups (Admin, Gerente, Funcionario) and task permissions."

    def handle(self, *args, **options):
        setup_default_groups_live()
        group_names = ", ".join(DEFAULT_GROUPS.keys())
        self.stdout.write(
            self.style.SUCCESS(f"Default groups created or updated successfully: {group_names}")
        )
