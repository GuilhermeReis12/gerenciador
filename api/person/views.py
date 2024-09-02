from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from person import models
from . import filters
from person import serializer
from person.models import Person, State, City
from person.serializer import PersonSerializer, CitySerializer, StateSerializer
from django_filters.rest_framework import DjangoFilterBackend


class StateView(ModelViewSet):
    permission_classes = []
    authorization_classes = []

    queryset = models.State.objects.all()
    serializer_class = StateSerializer
    filter_backends = [DjangoFilterBackend]
    search_fields = "__all__"


class CityView(ModelViewSet):
    permission_classes = []
    authorization_classes = []

    queryset = models.City.objects.all()
    serializer_class = CitySerializer
    filterset_class = filters.CityFilter
    filter_backends = [DjangoFilterBackend]


class PersonView(ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = [DjangoFilterBackend]
    search_fields = ["__all__"]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return serializer.PersonForm
        return serializer.PersonSerializer

    def perform_create(self, serializer):
        return serializer.save()


class PersonCreateView(ModelViewSet):
    permission_classes = []
    authorization_classes = []
    serializer_class = serializer.PersonForm
    filter_backends = [DjangoFilterBackend]
    search_fields = ["__all__"]

    def perform_create(self, serializer):
        return serializer.save()
