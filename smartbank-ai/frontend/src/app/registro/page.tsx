"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { RUTAS_API } from "@/servicios/api";

type ErrorApi = {
  detail?: string;
  non_field_errors?: string[];
  dni?: string[];
  nombre?: string[];
  apellidos?: string[];
  email?: string[];
  telefono?: string[];
  password?: string[];
  password2?: string[];
};

export default function RegistroPage() {
  const router = useRouter();

  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const obtenerMensajeError = (datos: ErrorApi) => {
    return (
      datos.detail ||
      datos.non_field_errors?.[0] ||
      datos.dni?.[0] ||
      datos.nombre?.[0] ||
      datos.apellidos?.[0] ||
      datos.email?.[0] ||
      datos.telefono?.[0] ||
      datos.password?.[0] ||
      datos.password2?.[0] ||
      "No se ha podido registrar el cliente."
    );
  };

  const registrarCliente = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    setError("");
    setMensajeOk("");

    if (contrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(RUTAS_API.registro, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: dni.trim().toUpperCase(),
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          password: contrasena,
          password2: repetirContrasena,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(obtenerMensajeError(datos));
        return;
      }

      localStorage.setItem("token_smartbank", datos.token);
      localStorage.setItem("usuario_smartbank", JSON.stringify(datos.usuario));

      if (datos.cuenta_inicial) {
        localStorage.setItem(
          "cuenta_inicial_smartbank",
          JSON.stringify(datos.cuenta_inicial)
        );
      }

      setMensajeOk("Cliente registrado correctamente. Redirigiendo al panel...");

      setTimeout(() => {
        router.push("/panel");
      }, 800);
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
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="mb-8 text-sm font-medium text-emerald-300 hover:text-emerald-200"
        >
          ← Volver al inicio
        </Link>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
            Nuevo cliente
          </span>

          <h1 className="mt-6 text-3xl font-bold">Crear cuenta</h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Registra un nuevo cliente. El backend creará automáticamente una
            cuenta corriente inicial.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {mensajeOk && (
            <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
              {mensajeOk}
            </div>
          )}

          <form onSubmit={registrarCliente} className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                DNI
              </label>
              <input
                type="text"
                value={dni}
                onChange={(evento) => setDni(evento.target.value)}
                placeholder="22334455D"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Cliente"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Apellidos
              </label>
              <input
                type="text"
                value={apellidos}
                onChange={(evento) => setApellidos(evento.target.value)}
                placeholder="Prueba Frontend"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="cliente.frontend@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Teléfono
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(evento) => setTelefono(evento.target.value)}
                placeholder="600000004"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Contraseña
              </label>
              <input
                type="password"
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                placeholder="Contraseña segura"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Repetir contraseña
              </label>
              <input
                type="password"
                value={repetirContrasena}
                onChange={(evento) => setRepetirContrasena(evento.target.value)}
                placeholder="Repite la contraseña"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {cargando ? "Registrando cliente..." : "Registrar cliente"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/acceso"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}