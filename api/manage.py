import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings.development")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Não foi possível importar o Django. Você tem certeza de que ele está instalado e disponível na variável de ambiente PYTHONPATH? Esqueceu-se de ativar um ambiente virtual?"
        ) from exc
    execute_from_command_line(sys.argv)
