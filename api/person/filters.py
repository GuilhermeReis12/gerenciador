import django_filters
from .models import Person, City, State


class CityFilter(django_filters.FilterSet):
    class Meta:
        model = City
        fields = {
            "id",
            "name",
            "state__id",
        }
