from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from movimientos.models import Movimiento


class ConsultaAsistenteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pregunta = str(request.data.get("pregunta", "")).strip()

        if not pregunta:
            return Response(
                {"pregunta": ["Debes escribir una consulta."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pregunta_normalizada = self.normalizar_texto(pregunta)
        usuario = request.user
        cuentas = usuario.cuentas.filter(activa=True)

        if not cuentas.exists():
            return Response(
                {
                    "respuesta": (
                        "No tienes ninguna cuenta activa asociada a tu usuario."
                    )
                },
                status=status.HTTP_200_OK,
            )

        if self.contiene_alguna(
            pregunta_normalizada,
            ["hola", "buenas", "buenos dias", "buenas tardes"],
        ):
            return Response(
                {
                    "respuesta": (
                        f"¡Hola, {usuario.nombre or usuario.dni}! "
                        "Puedo ayudarte a consultar tu saldo, tus gastos, "
                        "tus ingresos y la categoría en la que más consumes."
                    )
                }
            )

        if self.contiene_alguna(
            pregunta_normalizada,
            ["saldo", "dinero tengo", "saldo total"],
        ):
            saldo_total = cuentas.aggregate(
                total=Sum("saldo")
            )["total"] or Decimal("0.00")

            return Response(
                {
                    "respuesta": (
                        f"Tu saldo total actual es de "
                        f"{saldo_total.quantize(Decimal('0.01'))} €."
                    )
                }
            )

        fecha_inicio_mes = timezone.now().replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        movimientos_mes = Movimiento.objects.filter(
            cuenta__in=cuentas,
            fecha__gte=fecha_inicio_mes,
        )

        if self.contiene_alguna(
            pregunta_normalizada,
            ["gastado", "gastos", "cuanto he gastado"],
        ):
            gastos = movimientos_mes.filter(
                tipo="gasto"
            ).aggregate(total=Sum("importe"))["total"] or Decimal("0.00")

            return Response(
                {
                    "respuesta": (
                        f"Este mes has gastado "
                        f"{gastos.quantize(Decimal('0.01'))} €."
                    )
                }
            )

        if self.contiene_alguna(
            pregunta_normalizada,
            ["ingresado", "ingresos", "cuanto he ingresado"],
        ):
            ingresos = movimientos_mes.filter(
                tipo="ingreso"
            ).aggregate(total=Sum("importe"))["total"] or Decimal("0.00")

            return Response(
                {
                    "respuesta": (
                        f"Este mes has ingresado "
                        f"{ingresos.quantize(Decimal('0.01'))} €."
                    )
                }
            )

        if self.contiene_alguna(
            pregunta_normalizada,
            ["categoria", "gasto mas", "donde gasto mas"],
        ):
            categoria_principal = (
                movimientos_mes.filter(tipo="gasto")
                .values("categoria")
                .annotate(total=Sum("importe"))
                .order_by("-total")
                .first()
            )

            if not categoria_principal:
                return Response(
                    {
                        "respuesta": (
                            "Todavía no tienes gastos registrados este mes."
                        )
                    }
                )

            return Response(
                {
                    "respuesta": (
                        "La categoría en la que más has gastado este mes es "
                        f"{categoria_principal['categoria']}, con "
                        f"{categoria_principal['total'].quantize(Decimal('0.01'))} €."
                    )
                }
            )

        if self.contiene_alguna(
            pregunta_normalizada,
            ["ahorro", "recomendacion", "consejo"],
        ):
            ingresos = movimientos_mes.filter(
                tipo="ingreso"
            ).aggregate(total=Sum("importe"))["total"] or Decimal("0.00")

            gastos = movimientos_mes.filter(
                tipo="gasto"
            ).aggregate(total=Sum("importe"))["total"] or Decimal("0.00")

            diferencia = ingresos - gastos

            if ingresos <= 0:
                mensaje = (
                    "No tengo suficientes ingresos registrados este mes "
                    "para calcular una recomendación de ahorro."
                )
            elif diferencia > 0:
                porcentaje = (diferencia / ingresos) * Decimal("100")

                mensaje = (
                    f"Este mes tienes un ahorro estimado de "
                    f"{diferencia.quantize(Decimal('0.01'))} €, "
                    f"equivalente al {porcentaje.quantize(Decimal('0.01'))} % "
                    "de tus ingresos."
                )
            else:
                mensaje = (
                    "Este mes tus gastos igualan o superan tus ingresos. "
                    "Te recomiendo revisar primero las categorías con mayor gasto."
                )

            return Response({"respuesta": mensaje})

        return Response(
            {
                "respuesta": (
                    "No he entendido completamente la consulta. "
                    "Puedes preguntarme por tu saldo, gastos del mes, "
                    "ingresos del mes, categoría principal o ahorro."
                )
            }
        )

    @staticmethod
    def normalizar_texto(texto):
        return (
            texto.lower()
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
            .replace("ü", "u")
            .replace("¿", "")
            .replace("?", "")
            .strip()
        )

    @staticmethod
    def contiene_alguna(texto, expresiones):
        return any(expresion in texto for expresion in expresiones)