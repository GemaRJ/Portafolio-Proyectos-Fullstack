"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [totalMovimientos, setTotalMovimientos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token_smartbank");
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

        const datosMovimientos:
          | RespuestaPaginada<unknown>
          | unknown[] = await respuestaMovimientos.json();

        const listaCuentas = Array.isArray(datosCuentas)
          ? datosCuentas
          : datosCuentas.results;

        const numeroMovimientos = Array.isArray(datosMovimientos)
          ? datosMovimientos.length
          : datosMovimientos.count;

        setCuentas(listaCuentas);
        setTotalMovimientos(numeroMovimientos);
      } catch {
        setError(
          "No se han podido cargar los datos. Comprueba que el backend esté funcionando."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem("token_smartbank");
    localStorage.removeItem("usuario_smartbank");
    router.push("/acceso");
  };

  const cuentasActivas = cuentas.filter((cuenta) => cuenta.activa).length;

  const saldoTotal = cuentas.reduce((total, cuenta) => {
    return total + Number(cuenta.saldo);
  }, 0);

  const saldoFormateado = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(saldoTotal);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-emerald-300">Cargando panel financiero...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
              Panel financiero
            </span>

            <h1 className="mt-4 text-3xl font-bold">
              Bienvenida a SmartBank AI
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Usuario conectado:{" "}
              <span className="font-semibold text-emerald-300">
                {usuario?.dni}
              </span>
            </p>
          </div>

          <button
            onClick={cerrarSesion}
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
          >
            Cerrar sesión
          </button>
        </header>

        {error && (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Saldo total</p>
            <h2 className="mt-3 text-3xl font-bold text-emerald-300">
              {saldoFormateado}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Calculado desde las cuentas devueltas por la API.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Cuentas activas</p>
            <h2 className="mt-3 text-3xl font-bold text-emerald-300">
              {cuentasActivas}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Cuentas activas asociadas al usuario autenticado.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Movimientos</p>
            <h2 className="mt-3 text-3xl font-bold text-emerald-300">
              {totalMovimientos}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Total de movimientos cargados desde la API.
            </p>
          </article>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-emerald-300">
            Cuentas bancarias
          </h2>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Número de cuenta</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Saldo</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {cuentas.map((cuenta) => (
                  <tr
                    key={cuenta.id}
                    className="border-t border-slate-800 text-slate-200"
                  >
                    <td className="px-4 py-3">{cuenta.numero_cuenta}</td>
                    <td className="px-4 py-3 capitalize">
                      {cuenta.tipo_cuenta}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-300">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      }).format(Number(cuenta.saldo))}
                    </td>
                    <td className="px-4 py-3">
                      {cuenta.activa ? "Activa" : "Inactiva"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-emerald-300">
            Operaciones bancarias
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            En la siguiente fase conectaremos estas acciones con el backend.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <button className="rounded-xl border border-slate-700 px-5 py-4 text-left transition hover:border-emerald-400 hover:text-emerald-300">
              Ingreso
            </button>

            <button className="rounded-xl border border-slate-700 px-5 py-4 text-left transition hover:border-emerald-400 hover:text-emerald-300">
              Gasto
            </button>

            <button className="rounded-xl border border-slate-700 px-5 py-4 text-left transition hover:border-emerald-400 hover:text-emerald-300">
              Transferencia
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}