from django.contrib import admin

from django_admin_json_editor import JSONEditorWidget
from temas.models import Tema


def theme_schema(widget):
    return {
        "type": "object",
        "title": "theme",
        "properties": {
            "primary_main": {"type": "string"},
            "primary_dark": {"type": "string"},
            "primary_light": {"type": "string"},
            "primary_disabled": {"type": "string"},
            "secondary_lightest": {"type": "string"},
            "secondary_lightest2": {"type": "string"},
            "secondary_medium": {"type": "string"},
            "secondary_lighter": {"type": "string"},
            "secondary_greenAlt": {"type": "string"},
            "indicatorColor_ei": {"type": "string"},
            "indicatorColor_ef1": {"type": "string"},
            "indicatorColor_ef2": {"type": "string"},
            "indicatorColor_em": {"type": "string"},
            "feedbackColor_informative": {"type": "string"},
            "feedbackColor_warning": {"type": "string"},
            "feedbackColor_error": {"type": "string"},
            "textColor_black": {"type": "string"},
            "textColor_darkest": {"type": "string"},
            "textColor_dark": {"type": "string"},
            "textColor_light": {"type": "string"},
            "textColor_lighter": {"type": "string"},
            "textColor_white": {"type": "string"},
            "logo_header": {"type": "string"},
        },
    }


@admin.register(Tema)
class TemaAdmin(admin.ModelAdmin):
    list_display = ["ds_tema", "ativo"]

    def get_form(self, request, obj=None, **kwargs):
        widget = JSONEditorWidget(theme_schema, False)
        form = super().get_form(request, obj, widgets={"tema": widget}, **kwargs)
        return form
