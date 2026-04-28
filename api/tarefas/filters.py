import django_filters
from django.db.models import Q

from tarefas.models import Tarefa


class TarefaFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="filter_q")
    data_limite_de = django_filters.DateFilter(field_name="data_limite", lookup_expr="gte")
    data_limite_ate = django_filters.DateFilter(field_name="data_limite", lookup_expr="lte")

    class Meta:
        model = Tarefa
        fields = {
            "status": ["exact"],
            "prioridade": ["exact"],
            "arquivada": ["exact"],
        }

    def filter_q(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(titulo__icontains=value)
            | Q(descricao__icontains=value)
        )

