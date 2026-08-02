import random
import string
from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
from faker import Faker

from usuarios.models import Usuario
from cuentas.models import Cuenta
from movimientos.models import Movimiento
from transferencias.models import Transferencia


DOMINIO_DEMO = "smartbank-demo.test"


class Command(BaseCommand):
    help = (
        "Genera usuarios, cuentas, movimientos y transferencias ficticias "
        "para SmartBank AI."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--clientes",
            type=int,
            default=10,
            help="Número de clientes ficticios que se crearán.",
        )

        parser.add_argument(
            "--meses",
            type=int,
            default=12,
            help="Número de meses de histórico.",
        )

        parser.add_argument(
            "--movimientos-min",
            type=int,
            default=40,
            help="Mínimo de movimientos por cuenta corriente.",
        )

        parser.add_argument(
            "--movimientos-max",
            type=int,
            default=120,
            help="Máximo de movimientos por cuenta corriente.",
        )

        parser.add_argument(
            "--transferencias",
            type=int,
            default=None,
            help=(
                "Número total de transferencias. "
                "Por defecto se calculan según el número de clientes."
            ),
        )

        parser.add_argument(
            "--semilla",
            type=int,
            default=2026,
            help="Semilla para generar datos reproducibles.",
        )

        parser.add_argument(
            "--password",
            type=str,
            default="SmartBank2026!",
            help="Contraseña común para los usuarios demo.",
        )

        parser.add_argument(
            "--reiniciar-demo",
            action="store_true",
            help="Borra solamente los usuarios demo creados anteriormente.",
        )

    def handle(self, *args, **options):
        numero_clientes = options["clientes"]
        meses = options["meses"]
        movimientos_min = options["movimientos_min"]
        movimientos_max = options["movimientos_max"]
        numero_transferencias = options["transferencias"]
        semilla = options["semilla"]
        password = options["password"]
        reiniciar_demo = options["reiniciar_demo"]

        self.validar_argumentos(
            numero_clientes=numero_clientes,
            meses=meses,
            movimientos_min=movimientos_min,
            movimientos_max=movimientos_max,
        )

        random.seed(semilla)
        Faker.seed(semilla)

        faker = Faker("es_ES")

        if numero_transferencias is None:
            numero_transferencias = max(numero_clientes * 4, 0)

        self.stdout.write("")
        self.stdout.write(
            self.style.WARNING(
                "Generador de datos bancarios ficticios de SmartBank AI"
            )
        )
        self.stdout.write(f"Clientes: {numero_clientes}")
        self.stdout.write(f"Histórico: {meses} meses")
        self.stdout.write(
            f"Movimientos por cuenta: {movimientos_min}-{movimientos_max}"
        )
        self.stdout.write(f"Transferencias: {numero_transferencias}")
        self.stdout.write(f"Semilla: {semilla}")
        self.stdout.write("")

        try:
            with transaction.atomic():
                if reiniciar_demo:
                    eliminados = Usuario.objects.filter(
                        email__endswith=f"@{DOMINIO_DEMO}"
                    ).count()

                    Usuario.objects.filter(
                        email__endswith=f"@{DOMINIO_DEMO}"
                    ).delete()

                    self.stdout.write(
                        self.style.WARNING(
                            f"Usuarios demo anteriores eliminados: {eliminados}"
                        )
                    )

                usuarios = self.crear_usuarios(
                    faker=faker,
                    cantidad=numero_clientes,
                    password=password,
                )

                cuentas = self.crear_cuentas(usuarios)

                self.crear_movimientos(
                    faker=faker,
                    cuentas=cuentas,
                    meses=meses,
                    movimientos_min=movimientos_min,
                    movimientos_max=movimientos_max,
                )

                transferencias_creadas = self.crear_transferencias(
                    faker=faker,
                    cuentas=cuentas,
                    cantidad=numero_transferencias,
                    meses=meses,
                )

                self.mostrar_resumen(
                    usuarios_creados=len(usuarios),
                    cuentas_creadas=len(cuentas),
                    transferencias_creadas=transferencias_creadas,
                    password=password,
                )

        except Exception as error:
            raise CommandError(
                f"No se pudieron generar los datos: {error}"
            ) from error

    def validar_argumentos(
        self,
        numero_clientes,
        meses,
        movimientos_min,
        movimientos_max,
    ):
        if numero_clientes < 1:
            raise CommandError("--clientes debe ser mayor que cero.")

        if meses < 1:
            raise CommandError("--meses debe ser mayor que cero.")

        if movimientos_min < 0:
            raise CommandError(
                "--movimientos-min no puede ser negativo."
            )

        if movimientos_max < movimientos_min:
            raise CommandError(
                "--movimientos-max debe ser igual o mayor "
                "que --movimientos-min."
            )

    def crear_usuarios(self, faker, cantidad, password):
        usuarios = []

        for indice in range(1, cantidad + 1):
            dni = self.generar_dni_unico()
            nombre = faker.first_name()
            apellidos = faker.last_name()

            email = (
                f"cliente.{dni.lower()}@{DOMINIO_DEMO}"
            )

            usuario = Usuario.objects.create_user(
                dni=dni,
                password=password,
                nombre=nombre,
                apellidos=apellidos,
                email=email,
                telefono=self.generar_telefono(),
                is_active=True,
            )

            usuarios.append(usuario)

            if indice % 50 == 0:
                self.stdout.write(
                    f"Usuarios creados: {indice}/{cantidad}"
                )

        return usuarios

    def crear_cuentas(self, usuarios):
        cuentas = []

        for usuario in usuarios:
            cuenta_corriente = Cuenta.objects.create(
                usuario=usuario,
                numero_cuenta=self.generar_numero_cuenta_unico(),
                tipo_cuenta="corriente",
                saldo=Decimal("0.00"),
                activa=True,
            )

            cuentas.append(cuenta_corriente)

            # Aproximadamente un 35 % tendrá también cuenta de ahorro.
            if random.random() < 0.35:
                cuenta_ahorro = Cuenta.objects.create(
                    usuario=usuario,
                    numero_cuenta=self.generar_numero_cuenta_unico(),
                    tipo_cuenta="ahorro",
                    saldo=Decimal("0.00"),
                    activa=True,
                )

                cuentas.append(cuenta_ahorro)

        return cuentas

    def crear_movimientos(
        self,
        faker,
        cuentas,
        meses,
        movimientos_min,
        movimientos_max,
    ):
        fecha_inicio = timezone.now() - timedelta(days=meses * 30)

        movimientos_creados = 0

        for cuenta in cuentas:
            saldo = Decimal(
                str(round(random.uniform(1000, 7000), 2))
            )

            movimientos = []

            movimiento_inicial = Movimiento.objects.create(
                cuenta=cuenta,
                concepto="Saldo inicial de demostración",
                importe=saldo,
                tipo="ingreso",
                categoria="otros",
            )

            fecha_movimiento_inicial = fecha_inicio

            Movimiento.objects.filter(
                pk=movimiento_inicial.pk
            ).update(fecha=fecha_movimiento_inicial)

            movimientos_creados += 1

            if cuenta.tipo_cuenta == "ahorro":
                cantidad_movimientos = random.randint(
                    max(5, movimientos_min // 4),
                    max(10, movimientos_max // 4),
                )
            else:
                cantidad_movimientos = random.randint(
                    movimientos_min,
                    movimientos_max,
                )

            fechas = sorted(
                self.generar_fecha_aleatoria(fecha_inicio)
                for _ in range(cantidad_movimientos)
            )

            for fecha in fechas:
                if cuenta.tipo_cuenta == "ahorro":
                    datos = self.generar_movimiento_ahorro(saldo)
                else:
                    datos = self.generar_movimiento_corriente(
                        faker=faker,
                        saldo=saldo,
                    )

                importe = datos["importe"]
                tipo = datos["tipo"]

                if tipo == "ingreso":
                    saldo += importe
                elif tipo == "gasto":
                    saldo -= importe

                movimiento = Movimiento.objects.create(
                    cuenta=cuenta,
                    concepto=datos["concepto"],
                    importe=importe,
                    tipo=tipo,
                    categoria=datos["categoria"],
                )

                Movimiento.objects.filter(
                    pk=movimiento.pk
                ).update(fecha=fecha)

                movimientos.append(movimiento)
                movimientos_creados += 1

            cuenta.saldo = saldo.quantize(Decimal("0.01"))
            cuenta.save(update_fields=["saldo"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Movimientos creados: {movimientos_creados}"
            )
        )

    def generar_movimiento_corriente(self, faker, saldo):
        ingresos = [
            ("Nómina mensual", "nomina", 1200, 3200),
            ("Transferencia recibida", "transferencia", 50, 1500),
            ("Bizum recibido", "otros", 5, 250),
            ("Devolución de recibo", "otros", 15, 300),
            ("Ingreso extraordinario", "otros", 100, 1000),
        ]

        gastos = [
            ("Compra en Mercadona", "alimentacion", 15, 180),
            ("Compra en Carrefour", "alimentacion", 20, 220),
            ("Restaurante", "ocio", 15, 120),
            ("Suscripción Netflix", "ocio", 9, 25),
            ("Suscripción Spotify", "ocio", 6, 18),
            ("Compra en Amazon", "compras", 15, 350),
            ("Gasolina", "transporte", 30, 110),
            ("Abono transporte", "transporte", 20, 70),
            ("Recibo de electricidad", "suministros", 40, 180),
            ("Recibo de agua", "suministros", 20, 90),
            ("Recibo de gas", "suministros", 30, 160),
            ("Factura de teléfono", "suministros", 20, 90),
            ("Compra en farmacia", "compras", 8, 120),
            ("Retirada de efectivo", "otros", 20, 300),
            ("Seguro", "otros", 80, 600),
            ("Compra de ropa", "compras", 20, 250),
            ("Viaje y alojamiento", "ocio", 100, 900),
            ("Pago de alquiler o hipoteca", "otros", 500, 1400),
        ]

        # Aproximadamente un 20 % de ingresos y un 80 % de gastos.
        generar_ingreso = random.random() < 0.20

        # Si el saldo es bajo, aumentamos la probabilidad de ingreso.
        if saldo < Decimal("300.00"):
            generar_ingreso = True

        if generar_ingreso:
            concepto, categoria, minimo, maximo = random.choice(
                ingresos
            )

            importe = Decimal(
                str(round(random.uniform(minimo, maximo), 2))
            )

            return {
                "concepto": concepto,
                "categoria": categoria,
                "tipo": "ingreso",
                "importe": importe,
            }

        concepto, categoria, minimo, maximo = random.choice(gastos)

        maximo_permitido = min(
            Decimal(str(maximo)),
            max(Decimal("5.00"), saldo * Decimal("0.35")),
        )

        minimo_decimal = Decimal(str(minimo))

        if maximo_permitido < minimo_decimal:
            maximo_permitido = minimo_decimal

        importe = Decimal(
            str(
                round(
                    random.uniform(
                        float(minimo_decimal),
                        float(maximo_permitido),
                    ),
                    2,
                )
            )
        )

        if importe > saldo:
            importe = max(
                Decimal("1.00"),
                saldo * Decimal("0.20"),
            ).quantize(Decimal("0.01"))

        return {
            "concepto": concepto,
            "categoria": categoria,
            "tipo": "gasto",
            "importe": importe,
        }

    def generar_movimiento_ahorro(self, saldo):
        if random.random() < 0.75 or saldo < Decimal("200.00"):
            importe = Decimal(
                str(round(random.uniform(25, 500), 2))
            )

            return {
                "concepto": "Aportación a cuenta de ahorro",
                "categoria": "otros",
                "tipo": "ingreso",
                "importe": importe,
            }

        maximo = min(
            Decimal("500.00"),
            saldo * Decimal("0.30"),
        )

        importe = Decimal(
            str(round(random.uniform(10, float(maximo)), 2))
        )

        return {
            "concepto": "Retirada de cuenta de ahorro",
            "categoria": "otros",
            "tipo": "gasto",
            "importe": importe,
        }

    def crear_transferencias(
        self,
        faker,
        cuentas,
        cantidad,
        meses,
    ):
        cuentas_corrientes = [
            cuenta
            for cuenta in cuentas
            if cuenta.tipo_cuenta == "corriente"
            and cuenta.activa
        ]

        if len(cuentas_corrientes) < 2:
            self.stdout.write(
                self.style.WARNING(
                    "No hay suficientes cuentas para crear transferencias."
                )
            )
            return 0

        fecha_inicio = timezone.now() - timedelta(days=meses * 30)
        creadas = 0

        conceptos = [
            "Transferencia entre particulares",
            "Pago compartido",
            "Alquiler",
            "Reserva de viaje",
            "Pago de factura",
            "Transferencia familiar",
            "Compra de segunda mano",
            "Aportación mensual",
        ]

        for _ in range(cantidad):
            cuenta_origen, cuenta_destino = random.sample(
                cuentas_corrientes,
                2,
            )

            saldo_origen = cuenta_origen.saldo

            if saldo_origen <= Decimal("25.00"):
                continue

            maximo = min(
                Decimal("1200.00"),
                saldo_origen * Decimal("0.25"),
            )

            if maximo < Decimal("5.00"):
                continue

            importe = Decimal(
                str(round(random.uniform(5, float(maximo)), 2))
            )

            concepto = random.choice(conceptos)
            fecha = self.generar_fecha_aleatoria(fecha_inicio)

            transferencia = Transferencia.objects.create(
                cuenta_origen=cuenta_origen,
                cuenta_destino=cuenta_destino,
                importe=importe,
                concepto=concepto,
                realizada=True,
            )

            Transferencia.objects.filter(
                pk=transferencia.pk
            ).update(fecha=fecha)

            movimiento_salida = Movimiento.objects.create(
                cuenta=cuenta_origen,
                concepto=f"Transferencia enviada: {concepto}",
                importe=importe,
                tipo="transferencia",
                categoria="transferencia",
            )

            Movimiento.objects.filter(
                pk=movimiento_salida.pk
            ).update(fecha=fecha)

            movimiento_entrada = Movimiento.objects.create(
                cuenta=cuenta_destino,
                concepto=f"Transferencia recibida: {concepto}",
                importe=importe,
                tipo="transferencia",
                categoria="transferencia",
            )

            Movimiento.objects.filter(
                pk=movimiento_entrada.pk
            ).update(fecha=fecha)

            cuenta_origen.saldo -= importe
            cuenta_destino.saldo += importe

            cuenta_origen.save(update_fields=["saldo"])
            cuenta_destino.save(update_fields=["saldo"])

            creadas += 1

        return creadas

    def generar_dni_unico(self):
        while True:
            numeros = "".join(
                random.choices(string.digits, k=8)
            )
            letra = random.choice(string.ascii_uppercase)
            dni = f"{numeros}{letra}"

            if not Usuario.objects.filter(dni=dni).exists():
                return dni

    def generar_numero_cuenta_unico(self):
        while True:
            numero = "ES" + "".join(
                random.choices(string.digits, k=22)
            )

            if not Cuenta.objects.filter(
                numero_cuenta=numero
            ).exists():
                return numero

    def generar_telefono(self):
        inicio = random.choice(["6", "7"])
        resto = "".join(random.choices(string.digits, k=8))
        return f"{inicio}{resto}"

    def generar_fecha_aleatoria(self, fecha_inicio):
        ahora = timezone.now()
        segundos_totales = int(
            (ahora - fecha_inicio).total_seconds()
        )

        segundos_aleatorios = random.randint(
            0,
            max(segundos_totales, 1),
        )

        return fecha_inicio + timedelta(
            seconds=segundos_aleatorios
        )

    def mostrar_resumen(
        self,
        usuarios_creados,
        cuentas_creadas,
        transferencias_creadas,
        password,
    ):
        total_usuarios_demo = Usuario.objects.filter(
            email__endswith=f"@{DOMINIO_DEMO}"
        ).count()

        total_cuentas = Cuenta.objects.filter(
            usuario__email__endswith=f"@{DOMINIO_DEMO}"
        ).count()

        total_movimientos = Movimiento.objects.filter(
            cuenta__usuario__email__endswith=f"@{DOMINIO_DEMO}"
        ).count()

        total_transferencias = Transferencia.objects.filter(
            cuenta_origen__usuario__email__endswith=f"@{DOMINIO_DEMO}"
        ).count()

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "Datos bancarios generados correctamente."
            )
        )
        self.stdout.write(
            f"Usuarios creados en esta ejecución: {usuarios_creados}"
        )
        self.stdout.write(
            f"Cuentas creadas en esta ejecución: {cuentas_creadas}"
        )
        self.stdout.write(
            "Transferencias creadas en esta ejecución: "
            f"{transferencias_creadas}"
        )
        self.stdout.write("")
        self.stdout.write(
            f"Total usuarios demo: {total_usuarios_demo}"
        )
        self.stdout.write(f"Total cuentas demo: {total_cuentas}")
        self.stdout.write(
            f"Total movimientos demo: {total_movimientos}"
        )
        self.stdout.write(
            f"Total transferencias demo: {total_transferencias}"
        )
        self.stdout.write("")
        self.stdout.write(
            self.style.WARNING(
                f"Contraseña común de usuarios demo: {password}"
            )
        )