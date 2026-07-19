"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { RUTAS_API } from "@/servicios/api";

type UsuarioSmartBank = {
  id: number;
  dni: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
};

type Cuenta = {
  id: number;
  usuario: number;
  usuario_dni: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  saldo: string;
  activa: boolean;
  fecha_creacion: string;
};

type Movimiento = {
  id: number;
  cuenta: number;
  numero_cuenta: string;
  concepto: string;
  importe: string;
  tipo: string;
  categoria: string;
  fecha: string;
};

type RespuestaPaginada<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function PanelPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<UsuarioSmartBank | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [totalMovimientos, setTotalMovimientos] = useState(0);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const obtenerToken = () => {
    return localStorage.getItem("token_smartbank");
  };

  const formatearEuros = (valor: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(fecha));
  };

  const obtenerEstiloMovimiento = (tipo: string) => {
    if (tipo === "ingreso" || tipo === "bizum") {
      return "text-emerald-300";
    }

    if (tipo === "gasto") {
      return "text-red-300";
    }

    return "text-sky-300";
  };

  const obtenerSignoMovimiento = (tipo: string) => {
    if (tipo === "ingreso" || tipo === "bizum") {
      return "+";
    }

    if (tipo === "gasto") {
      return "-";
    }

    return "";
  };

  const cargarDatos = useCallback(async () => {
    const token = obtenerToken();
    const usuarioGuardado = localStorage.getItem("usuario_smartbank");

    if (!token) {
      router.push("/acceso");
      return;
    }

    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }

    try {
      const [respuestaCuentas, respuestaMovimientos] = await Promise.all([
        fetch(RUTAS_API.cuentas, {
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
        fetch(RUTAS_API.movimientos, {
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
      ]);

      if (!respuestaCuentas.ok || !respuestaMovimientos.ok) {
        throw new Error("No se han podido cargar los datos del panel.");
      }

      const datosCuentas: RespuestaPaginada<Cuenta> | Cuenta[] =
        await respuestaCuentas.json();

      const datosMovimientos: RespuestaPaginada<Movimiento> | Movimiento[] =
        await respuestaMovimientos.json();

      const listaCuentas = Array.isArray(datosCuentas)
        ? datosCuentas
        : datosCuentas.results;

      const listaMovimientos = Array.isArray(datosMovimientos)
        ? datosMovimientos
        : datosMovimientos.results;

      const numeroMovimientos = Array.isArray(datosMovimientos)
        ? datosMovimientos.length
        : datosMovimientos.count;

      setCuentas(listaCuentas);
      setMovimientos(listaMovimientos);
      setTotalMovimientos(numeroMovimientos);
    } catch {
      setError(
        "No se han podido cargar los datos. Comprueba que el backend esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  }, [router]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const cerrarSesion = () => {
    localStorage.removeItem("token_smartbank");
    localStorage.removeItem("usuario_smartbank");
    localStorage.removeItem("cuenta_inicial_smartbank");
    router.push("/acceso");
  };

  const cuentasActivas = cuentas.filter((cuenta) => cuenta.activa).length;

  const saldoTotal = cuentas.reduce((total, cuenta) => {
    return total + Number(cuenta.saldo);
  }, 0);

  const cuentaPrincipal = cuentas[0];
  const ultimosMovimientos = movimientos.slice(0, 6);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-emerald-300">Cargando panel financiero...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
              SmartBank AI · Panel cliente
            </span>

            <h1 className="mt-4 text-3xl font-bold md:text-4xl">
              Hola, {usuario?.nombre || usuario?.dni}
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Resumen financiero conectado con Django REST Framework.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="http://127.0.0.1:8000/api/docs/"
              target="_blank"
              className="rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Ver API
            </a>

            <button
              onClick={cerrarSesion}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-red-400 hover:text-red-300"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <article className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 p-8 shadow-2xl">
            <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative">
              <p className="text-sm text-slate-300">Saldo total disponible</p>

              <h2 className="mt-4 text-5xl font-bold tracking-tight text-emerald-300">
                {formatearEuros(saldoTotal)}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Calculado automáticamente a partir de las cuentas devueltas por
                la API del backend.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Cuentas activas
                  </p>
                  <p className="mt-2 text-2xl font-bold">{cuentasActivas}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Movimientos
                  </p>
                  <p className="mt-2 text-2xl font-bold">{totalMovimientos}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Usuario
                  </p>
                  <p className="mt-2 text-2xl font-bold">{usuario?.dni}</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Cuenta principal</p>

            {cuentaPrincipal ? (
              <>
                <h2 className="mt-4 text-xl font-semibold text-emerald-300">
                  {cuentaPrincipal.tipo_cuenta === "ahorro"
                    ? "Cuenta de ahorro"
                    : "Cuenta corriente"}
                </h2>

                <p className="mt-3 break-all text-sm text-slate-300">
                  {cuentaPrincipal.numero_cuenta}
                </p>

                <p className="mt-6 text-3xl font-bold">
                  {formatearEuros(Number(cuentaPrincipal.saldo))}
                </p>

                <p className="mt-3 text-sm text-slate-400">
                  Estado: {cuentaPrincipal.activa ? "Activa" : "Inactiva"}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                No hay cuentas disponibles.
              </p>
            )}
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <button className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-emerald-400 hover:bg-emerald-400/10">
            <p className="text-sm text-slate-400">Acción rápida</p>
            <h3 className="mt-3 text-xl font-semibold text-emerald-300">
              Nuevo ingreso
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Preparado para conectar con la API de ingresos.
            </p>
          </button>

          <button className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-red-400 hover:bg-red-400/10">
            <p className="text-sm text-slate-400">Acción rápida</p>
            <h3 className="mt-3 text-xl font-semibold text-red-300">
              Nuevo gasto
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Preparado para conectar con la API de gastos.
            </p>
          </button>

          <button className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left transition hover:border-sky-400 hover:bg-sky-400/10">
            <p className="text-sm text-slate-400">Acción rápida</p>
            <h3 className="mt-3 text-xl font-semibold text-sky-300">
              Nueva transferencia
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Preparado para conectar con la API de transferencias.
            </p>
          </button>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Cuentas bancarias</p>
                <h2 className="mt-2 text-2xl font-bold">Mis cuentas</h2>
              </div>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                {cuentas.length} cuentas
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {cuentas.map((cuenta) => (
                <div
                  key={cuenta.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        {cuenta.tipo_cuenta === "ahorro"
                          ? "Cuenta de ahorro"
                          : "Cuenta corriente"}
                      </p>

                      <p className="mt-2 break-all text-xs text-slate-400">
                        ID {cuenta.id} · {cuenta.numero_cuenta}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-emerald-300">
                        {formatearEuros(Number(cuenta.saldo))}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {cuenta.activa ? "Activa" : "Inactiva"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Actividad reciente</p>
                <h2 className="mt-2 text-2xl font-bold">Últimos movimientos</h2>
              </div>

              <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                API real
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {ultimosMovimientos.length > 0 ? (
                ultimosMovimientos.map((movimiento) => (
                  <div
                    key={movimiento.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-100">
                        {movimiento.concepto}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {movimiento.tipo} · {movimiento.categoria}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatearFecha(movimiento.fecha)}
                      </p>
                    </div>

                    <p
                      className={`text-lg font-bold ${obtenerEstiloMovimiento(
                        movimiento.tipo
                      )}`}
                    >
                      {obtenerSignoMovimiento(movimiento.tipo)}
                      {formatearEuros(Number(movimiento.importe))}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  Todavía no hay movimientos para mostrar.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-400/10 p-6">
          <p className="text-sm text-violet-200">Próxima evolución</p>

          <h2 className="mt-3 text-2xl font-bold text-violet-100">
            Asistente financiero con IA
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-violet-100/80">
            En próximas fases, SmartBank AI incorporará un asistente financiero
            inteligente capaz de analizar ingresos, gastos, movimientos y hábitos
            de consumo para generar recomendaciones personalizadas.
          </p>
        </section>
      </section>
    </main>
  );
}