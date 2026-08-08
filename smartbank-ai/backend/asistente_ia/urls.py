from django.urls import path

from .views import ConsultaAsistenteView


urlpatterns = [
    path(
        "consulta/",
        ConsultaAsistenteView.as_view(),
        name="asistente-consulta",
    ),
]