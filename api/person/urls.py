from rest_framework import routers
from person import views
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path("person", views.PersonView.as_view({"get": "list"})),
    path("person-create", views.PersonCreateView.as_view({"post": "create"})),
    path("cities", views.CityView.as_view({"get": "list"})),
    path("states", views.StateView.as_view({"get": "list"})),
]


urlpatterns = format_suffix_patterns(urlpatterns)
