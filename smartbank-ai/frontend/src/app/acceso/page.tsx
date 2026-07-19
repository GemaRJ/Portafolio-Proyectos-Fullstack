"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { RUTAS_API } from "@/servicios/api";

export default function AccesoPage() {
  const router = useRouter();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(RUTAS_API.iniciarSesion, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: dni.trim().toUpperCase(),
          password: password,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        const mensaje =
          datos.detail ||
          datos.non_field_errors?.[0] ||
          datos.password?.[0] ||
          datos.dni?.[0] ||
          "No se ha podido iniciar sesión.";

        setError(mensaje);
        return;
      }

      localStorage.setItem("token_smartbank", datos.token);
      localStorage.setItem("usuario_smartbank", JSON.stringify(datos.usuario));

      router.push("/panel");
    } catch {
      setError(
        "No se ha podido conectar con el servidor. Comprueba que Django esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="mb-8 text-sm font-medium text-emerald-300 hover:text-emerald-200"
        >
          ← Volver al inicio
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
            Área cliente
          </span>

          <h1 className="mt-6 text-3xl font-bold">Acceso a SmartBank AI</h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Inicia sesión con tu DNI y contraseña para acceder al panel
            financiero.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={iniciarSesion} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                DNI
              </label>
              <input
                type="text"
                value={dni}
                onChange={(evento) => setDni(evento.target.value)}
                placeholder="12345678A"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                placeholder="Introduce tu contraseña"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? "Accediendo..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}