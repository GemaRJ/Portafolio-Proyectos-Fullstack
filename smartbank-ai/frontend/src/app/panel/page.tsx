"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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

type VistaActiva =
  | "resumen"
  | "movimientos"
  | "transferencia"
  | "divisa"
  | "menu";

type Divisa = "USD" | "GBP" | "MXN";

type TipoOperacion = "ingreso" | "gasto" | "transferencia";

type RespuestaCambioDivisa = {
  rate: number;
  date?: string;
  base?: string;
  quote?: string;
};

const nombresDivisa: Record<Divisa, string> = {
  USD: "Dólar Estadounidense (USD)",
  GBP: "Libra Esterlina (GBP)",
  MXN: "Peso Mexicano (MXN)",
};

export default function PanelPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<UsuarioSmartBank | null>(null);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [totalMovimientos, setTotalMovimientos] = useState(0);

  const [cuentaSeleccionadaId, setCuentaSeleccionadaId] = useState<
    number | null
  >(null);

  const [vistaActiva, setVistaActiva] = useState<VistaActiva>("resumen");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const [nombrePerfil, setNombrePerfil] = useState("");
  const [apellidosPerfil, setApellidosPerfil] = useState("");
  const [emailPerfil, setEmailPerfil] = useState("");
  const [telefonoPerfil, setTelefonoPerfil] = useState("");
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);

  const [importeTransferencia, setImporteTransferencia] = useState("");
  const [conceptoTransferencia, setConceptoTransferencia] = useState("");
  const [cuentaDestinoId, setCuentaDestinoId] = useState("");

  const [tipoOperacion, setTipoOperacion] =
    useState<TipoOperacion>("ingreso");
  const [categoriaOperacion, setCategoriaOperacion] = useState("otros");
  const [procesandoOperacion, setProcesandoOperacion] = useState(false);

  const [eurosConversion, setEurosConversion] = useState("1");
  const [divisaSeleccionada, setDivisaSeleccionada] = useState<Divisa>("USD");
  const [tasaCambio, setTasaCambio] = useState<number | null>(null);
  const [fechaCambio, setFechaCambio] = useState("");
  const [cargandoDivisa, setCargandoDivisa] = useState(false);
  const [errorDivisa, setErrorDivisa] = useState("");

  const obtenerToken = () => {
    return localStorage.getItem("token_smartbank");
  };

  const formatearEuros = (valor: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const formatearImporte = (valor: number, moneda: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: moneda,
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(fecha));
  };

  const obtenerColorImporte = (tipo: string) => {
    if (tipo === "ingreso" || tipo === "bizum") {
      return "text-emerald-300";
    }

    if (tipo === "gasto") {
      return "text-rose-300";
    }

    return "text-violet-300";
  };

  const obtenerSigno = (tipo: string) => {
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
      const usuarioLocal = JSON.parse(usuarioGuardado);

      setUsuario(usuarioLocal);
      setNombrePerfil(usuarioLocal.nombre || "");
      setApellidosPerfil(usuarioLocal.apellidos || "");
      setEmailPerfil(usuarioLocal.email || "");
      setTelefonoPerfil(usuarioLocal.telefono || "");
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

      if (listaCuentas.length > 0) {
        setCuentaSeleccionadaId((idActual) => idActual ?? listaCuentas[0].id);
      }
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

  const cuentaSeleccionada = useMemo(() => {
    return (
      cuentas.find((cuenta) => cuenta.id === cuentaSeleccionadaId) ||
      cuentas[0] ||
      null
    );
  }, [cuentas, cuentaSeleccionadaId]);

  const cuentasDestinoDisponibles = useMemo(() => {
    if (!cuentaSeleccionada) {
      return cuentas;
    }

    return cuentas.filter((cuenta) => cuenta.id !== cuentaSeleccionada.id);
  }, [cuentas, cuentaSeleccionada]);

  const movimientosCuentaSeleccionada = useMemo(() => {
    if (!cuentaSeleccionada) {
      return [];
    }

    return movimientos
      .filter((movimiento) => movimiento.cuenta === cuentaSeleccionada.id)
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
  }, [movimientos, cuentaSeleccionada]);

  const saldoTotal = cuentas.reduce((total, cuenta) => {
    return total + Number(cuenta.saldo);
  }, 0);

  const cuentasActivas = cuentas.filter((cuenta) => cuenta.activa).length;

  const saldoDisponible = Number(cuentaSeleccionada?.saldo || 0);

  const retencionesPendientes = 0;

  const saldoContable = saldoDisponible - retencionesPendientes;

  const diferenciaSaldo = saldoDisponible - saldoContable;

  const valorConvertido =
    Number(eurosConversion || 0) * Number(tasaCambio || 0);

  const nombreUsuario = usuario?.nombre || usuario?.dni || "Cliente SmartBank";

  const obtenerMensajeError = async (respuesta: Response) => {
    try {
      const datos = await respuesta.json();

      return (
        datos.detail ||
        datos.non_field_errors?.[0] ||
        datos[0] ||
        Object.values(datos).flat().join(" ") ||
        "No se ha podido realizar la operación."
      );
    } catch {
      return "No se ha podido realizar la operación.";
    }
  };

  const limpiarFormularioOperacion = () => {
    setImporteTransferencia("");
    setConceptoTransferencia("");
    setCuentaDestinoId("");
    setCategoriaOperacion("otros");
  };

  const obtenerTasaCambio = useCallback(async (divisa: Divisa) => {
    setCargandoDivisa(true);
    setErrorDivisa("");

    try {
      const respuesta = await fetch(
        `https://api.frankfurter.dev/v2/rate/EUR/${divisa}`
      );

      if (!respuesta.ok) {
        throw new Error("No se ha podido obtener el tipo de cambio.");
      }

      const datos: RespuestaCambioDivisa = await respuesta.json();

      setTasaCambio(datos.rate);
      setFechaCambio(datos.date || "");
    } catch {
      setErrorDivisa(
        "No se ha podido obtener el cambio de divisa en tiempo real."
      );
      setTasaCambio(null);
      setFechaCambio("");
    } finally {
      setCargandoDivisa(false);
    }
  }, []);

  useEffect(() => {
    obtenerTasaCambio(divisaSeleccionada);
  }, [divisaSeleccionada, obtenerTasaCambio]);

  const seleccionarTipoOperacion = (tipo: TipoOperacion) => {
    setTipoOperacion(tipo);
    setMensajeOk("");
    setError("");

    if (tipo !== "transferencia") {
      setCuentaDestinoId("");
    }
  };


  const guardarPerfil = async () => {
    const token = obtenerToken();

    if (!token) {
      router.push("/acceso");
      return;
    }

    setError("");
    setMensajeOk("");
    setGuardandoPerfil(true);

    try {
      const respuesta = await fetch(RUTAS_API.usuarioActual, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          nombre: nombrePerfil.trim(),
          apellidos: apellidosPerfil.trim(),
          email: emailPerfil.trim(),
          telefono: telefonoPerfil.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        const mensaje =
          datos.detail ||
          datos.non_field_errors?.[0] ||
          datos.nombre?.[0] ||
          datos.apellidos?.[0] ||
          datos.email?.[0] ||
          datos.telefono?.[0] ||
          "No se han podido actualizar los datos personales.";

        setError(mensaje);
        return;
      }

      setUsuario(datos);
      localStorage.setItem("usuario_smartbank", JSON.stringify(datos));
      setMensajeOk("Datos personales actualizados correctamente.");
    } catch {
      setError(
        "No se ha podido conectar con el servidor. Comprueba que Django esté funcionando."
      );
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const realizarOperacion = async () => {
    const token = obtenerToken();

    if (!token) {
      router.push("/acceso");
      return;
    }

    setError("");
    setMensajeOk("");

    if (!cuentaSeleccionada) {
      setError("Selecciona una cuenta origen.");
      return;
    }

    if (!importeTransferencia || Number(importeTransferencia) <= 0) {
      setError("El importe debe ser mayor que cero.");
      return;
    }

    if (!conceptoTransferencia.trim()) {
      setError("Introduce un concepto para la operación.");
      return;
    }

    if (tipoOperacion === "transferencia" && !cuentaDestinoId) {
      setError("Selecciona una cuenta destino.");
      return;
    }

    if (
      tipoOperacion === "transferencia" &&
      Number(cuentaDestinoId) === cuentaSeleccionada.id
    ) {
      setError("La cuenta destino no puede ser la misma que la cuenta origen.");
      return;
    }

    setProcesandoOperacion(true);

    try {
      let urlOperacion = RUTAS_API.ingreso;

      let cuerpoOperacion: Record<string, string | number> = {
        cuenta_id: cuentaSeleccionada.id,
        importe: importeTransferencia,
        concepto: conceptoTransferencia.trim(),
        categoria: categoriaOperacion,
      };

      if (tipoOperacion === "gasto") {
        urlOperacion = RUTAS_API.gasto;
      }

      if (tipoOperacion === "transferencia") {
        urlOperacion = RUTAS_API.transferencia;

        cuerpoOperacion = {
          cuenta_origen_id: cuentaSeleccionada.id,
          cuenta_destino_id: Number(cuentaDestinoId),
          importe: importeTransferencia,
          concepto: conceptoTransferencia.trim(),
        };
      }

      const respuesta = await fetch(urlOperacion, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(cuerpoOperacion),
      });

      if (!respuesta.ok) {
        const mensaje = await obtenerMensajeError(respuesta);
        setError(mensaje);
        return;
      }

      if (tipoOperacion === "ingreso") {
        setMensajeOk("Ingreso realizado correctamente.");
      }

      if (tipoOperacion === "gasto") {
        setMensajeOk("Gasto registrado correctamente.");
      }

      if (tipoOperacion === "transferencia") {
        setMensajeOk("Transferencia realizada correctamente.");
      }

      limpiarFormularioOperacion();
      await cargarDatos();
      setVistaActiva("movimientos");
    } catch {
      setError(
        "No se ha podido conectar con el servidor. Comprueba que Django esté funcionando."
      );
    } finally {
      setProcesandoOperacion(false);
    }
  };

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-emerald-300">Cargando panel bancario...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <button
              onClick={() => setVistaActiva("resumen")}
              className="text-left text-2xl font-bold text-emerald-300"
            >
              SmartBank AI
            </button>

            <div className="flex flex-wrap gap-2 lg:ml-8">
              {[
                ["resumen", "Resumen"],
                ["movimientos", "Movimientos"],
                ["transferencia", "Operaciones"],
                ["divisa", "Cambio Divisa"],
                ["menu", "Menú"],
              ].map(([vista, texto]) => (
                <button
                  key={vista}
                  onClick={() => setVistaActiva(vista as VistaActiva)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    vistaActiva === vista
                      ? "bg-violet-500 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-violet-300"
                  }`}
                >
                  {texto}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={cerrarSesion}
            className="rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400 hover:text-slate-950"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-8 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {mensajeOk && (
          <div className="mb-8 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            {mensajeOk}
          </div>
        )}

        {vistaActiva === "resumen" && (
          <>
            <header>
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-200">
                Dashboard financiero inteligente
              </span>

              <h1 className="mt-5 text-3xl font-bold md:text-4xl">
                Posición Global
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Resumen financiero detallado de tu actividad bancaria.
              </p>
            </header>

            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
              <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Estado de tus cuentas
                  </p>

                  <div className="mt-4 rounded-xl border-l-4 border-violet-400 bg-slate-950/80 p-5">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Titular principal
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {nombreUsuario}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Cuenta seleccionada acabada en{" "}
                      <span className="font-bold text-emerald-300">
                        {cuentaSeleccionada?.numero_cuenta.slice(-4)}
                      </span>
                    </p>
                  </div>

                  <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-700 to-slate-950 p-6 text-white shadow-xl">
                    <div className="absolute right-[-70px] top-[-70px] h-48 w-48 rounded-full bg-violet-400/30 blur-3xl" />

                    <div className="relative">
                      <p className="text-sm font-bold uppercase text-emerald-50">
                        Saldo disponible
                      </p>

                      <p className="mt-3 text-4xl font-bold">
                        {formatearEuros(saldoDisponible)}
                      </p>

                      <div className="mt-6 grid gap-4 border-t border-white/20 pt-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase text-emerald-100">
                            Saldo contable
                          </p>

                          <p className="mt-2 text-xl font-bold">
                            {formatearEuros(saldoContable)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase text-emerald-100">
                            Retenciones tarjeta
                          </p>

                          <p className="mt-2 text-xl font-bold text-amber-300">
                            {formatearEuros(retencionesPendientes)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Saldo total
                      </p>

                      <p className="mt-2 text-xl font-bold text-emerald-300">
                        {formatearEuros(saldoTotal)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Cuentas activas
                      </p>

                      <p className="mt-2 text-xl font-bold text-violet-300">
                        {cuentasActivas}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Movimientos
                      </p>

                      <p className="mt-2 text-xl font-bold text-violet-300">
                        {totalMovimientos}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-emerald-300">
                    Detalle de operaciones
                  </h2>

                  <p className="mt-6 text-sm leading-6 text-slate-300">
                    Selecciona una cuenta para consultar sus movimientos por
                    fecha. El panel muestra el saldo disponible y deja preparado
                    el cálculo de saldo contable con retenciones pendientes.
                  </p>

                  <div className="mt-6 rounded-2xl border-l-4 border-violet-400 bg-slate-950/80 p-5 shadow-sm">
                    <p className="font-bold text-white">Nota de seguridad</p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Si detectas alguna actividad inusual, revisa los últimos
                      movimientos o contacta con el departamento de
                      ciberseguridad.
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm">
                    <p className="text-sm font-bold uppercase text-slate-500">
                      Cuentas disponibles
                    </p>

                    <div className="mt-4 space-y-3">
                      {cuentas.map((cuenta) => (
                        <button
                          key={cuenta.id}
                          onClick={() => {
                            setCuentaSeleccionadaId(cuenta.id);
                            setCuentaDestinoId("");
                            setVistaActiva("movimientos");
                          }}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            cuentaSeleccionada?.id === cuenta.id
                              ? "border-emerald-400 bg-emerald-400/10"
                              : "border-slate-800 hover:border-violet-400 hover:bg-slate-900"
                          }`}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-bold text-white">
                                {cuenta.tipo_cuenta === "ahorro"
                                  ? "Cuenta de ahorro"
                                  : "Cuenta corriente"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                ID {cuenta.id} · {cuenta.numero_cuenta}
                              </p>
                            </div>

                            <p className="font-bold text-emerald-300">
                              {formatearEuros(Number(cuenta.saldo))}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {vistaActiva === "movimientos" && (
          <>
            <header>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                Historial por cuenta
              </span>

              <h1 className="mt-5 text-3xl font-bold md:text-4xl">
                Historial Detallado
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Control de ingresos, gastos y saldo de la cuenta seleccionada.
              </p>
            </header>

            <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <h2 className="text-xl font-bold">Seleccionar cuenta</h2>

                <div className="mt-5 space-y-3">
                  {cuentas.map((cuenta) => (
                    <button
                      key={cuenta.id}
                      onClick={() => {
                        setCuentaSeleccionadaId(cuenta.id);
                        setCuentaDestinoId("");
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        cuentaSeleccionada?.id === cuenta.id
                          ? "border-emerald-400 bg-emerald-400/10"
                          : "border-slate-800 bg-slate-950/70 hover:border-violet-400 hover:bg-slate-900"
                      }`}
                    >
                      <p className="font-bold">
                        {cuenta.tipo_cuenta === "ahorro"
                          ? "Cuenta de ahorro"
                          : "Cuenta corriente"}
                      </p>

                      <p className="mt-1 break-all text-xs text-slate-500">
                        {cuenta.numero_cuenta}
                      </p>

                      <p className="mt-3 text-lg font-bold text-emerald-300">
                        {formatearEuros(Number(cuenta.saldo))}
                      </p>
                    </button>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Cuenta actual</p>

                    <h2 className="mt-1 break-all text-xl font-bold">
                      {cuentaSeleccionada?.numero_cuenta}
                    </h2>
                  </div>

                  <p className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                    {formatearEuros(saldoDisponible)}
                  </p>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
                        <th className="py-3 pr-4">Concepto</th>
                        <th className="py-3 pr-4">Fecha</th>
                        <th className="py-3 pr-4">Tipo</th>
                        <th className="py-3 pr-4 text-right">Importe</th>
                      </tr>
                    </thead>

                    <tbody>
                      {movimientosCuentaSeleccionada.length > 0 ? (
                        movimientosCuentaSeleccionada.map((movimiento) => (
                          <tr
                            key={movimiento.id}
                            className="border-b border-slate-800"
                          >
                            <td className="py-4 pr-4 font-semibold">
                              {movimiento.concepto}

                              <p className="mt-1 text-xs font-normal text-slate-500">
                                {movimiento.categoria}
                              </p>
                            </td>

                            <td className="py-4 pr-4 text-slate-400">
                              {formatearFecha(movimiento.fecha)}
                            </td>

                            <td className="py-4 pr-4 capitalize text-slate-400">
                              {movimiento.tipo}
                            </td>

                            <td
                              className={`py-4 pr-4 text-right font-bold ${obtenerColorImporte(
                                movimiento.tipo
                              )}`}
                            >
                              {obtenerSigno(movimiento.tipo)}
                              {formatearEuros(Number(movimiento.importe))}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-slate-500"
                          >
                            Esta cuenta todavía no tiene movimientos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 rounded-2xl bg-slate-950/80 p-5">
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Saldo disponible
                      </p>

                      <p className="mt-2 font-bold text-emerald-300">
                        {formatearEuros(saldoDisponible)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Retenciones
                      </p>

                      <p className="mt-2 font-bold text-amber-300">
                        {formatearEuros(retencionesPendientes)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Saldo contable
                      </p>

                      <p className="mt-2 font-bold text-slate-200">
                        {formatearEuros(saldoContable)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Diferencia
                      </p>

                      <p className="mt-2 font-bold text-violet-300">
                        {formatearEuros(diferenciaSaldo)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-100">
                  Retenciones de tarjeta
                </h2>

                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                  Pendientes
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Este bloque queda preparado para una próxima fase. Ahora mismo el
                backend no tiene todavía un modelo específico de retenciones.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-950/80 p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="font-bold">Sin retenciones pendientes</p>

                    <p className="mt-1 text-sm text-slate-500">
                      Cuando creemos este modelo en Django aparecerán aquí.
                    </p>
                  </div>

                  <p className="font-bold text-rose-300">
                    {formatearEuros(retencionesPendientes)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="font-bold">Total retenido</p>

                  <p className="font-bold text-rose-300">
                    {formatearEuros(retencionesPendientes)}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {vistaActiva === "transferencia" && (
          <>
            <header>
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-200">
                Operaciones reales
              </span>

              <h1 className="mt-5 text-3xl font-bold md:text-4xl">
                Operaciones bancarias
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Realiza ingresos, gastos y transferencias reales contra Django
                REST Framework.
              </p>
            </header>

            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
              <div className="grid gap-4 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => seleccionarTipoOperacion("ingreso")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    tipoOperacion === "ingreso"
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-slate-800 bg-slate-950/80 hover:border-emerald-400"
                  }`}
                >
                  <p className="text-lg font-bold text-emerald-300">Ingreso</p>

                  <p className="mt-2 text-sm text-slate-400">
                    Suma dinero a la cuenta seleccionada.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => seleccionarTipoOperacion("gasto")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    tipoOperacion === "gasto"
                      ? "border-rose-400 bg-rose-400/10"
                      : "border-slate-800 bg-slate-950/80 hover:border-rose-400"
                  }`}
                >
                  <p className="text-lg font-bold text-rose-300">Gasto</p>

                  <p className="mt-2 text-sm text-slate-400">
                    Registra una salida de dinero.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => seleccionarTipoOperacion("transferencia")}
                  className={`rounded-2xl border p-5 text-left transition ${
                    tipoOperacion === "transferencia"
                      ? "border-violet-400 bg-violet-400/10"
                      : "border-slate-800 bg-slate-950/80 hover:border-violet-400"
                  }`}
                >
                  <p className="text-lg font-bold text-violet-300">
                    Transferencia
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Envía dinero a otra cuenta.
                  </p>
                </button>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Cuenta origen
                  </label>

                  <select
                    value={cuentaSeleccionada?.id || ""}
                    onChange={(evento) => {
                      setCuentaSeleccionadaId(Number(evento.target.value));
                      setCuentaDestinoId("");
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  >
                    {cuentas.map((cuenta) => (
                      <option key={cuenta.id} value={cuenta.id}>
                        ID {cuenta.id} · {cuenta.numero_cuenta} ·{" "}
                        {formatearEuros(Number(cuenta.saldo))}
                      </option>
                    ))}
                  </select>
                </div>

                {tipoOperacion === "transferencia" && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Cuenta destino
                    </label>

                    <select
                      value={cuentaDestinoId}
                      onChange={(evento) =>
                        setCuentaDestinoId(evento.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    >
                      <option value="">Selecciona una cuenta destino</option>

                      {cuentasDestinoDisponibles.map((cuenta) => (
                        <option key={cuenta.id} value={cuenta.id}>
                          ID {cuenta.id} · {cuenta.numero_cuenta} ·{" "}
                          {formatearEuros(Number(cuenta.saldo))}
                        </option>
                      ))}
                    </select>

                    {cuentasDestinoDisponibles.length === 0 && (
                      <p className="mt-2 text-sm text-amber-300">
                        No hay otra cuenta disponible para transferir.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Importe
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={importeTransferencia}
                    onChange={(evento) =>
                      setImporteTransferencia(evento.target.value)
                    }
                    placeholder="100.00"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                  />
                </div>

                {tipoOperacion !== "transferencia" && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Categoría
                    </label>

                    <select
                      value={categoriaOperacion}
                      onChange={(evento) =>
                        setCategoriaOperacion(evento.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                    >
                      <option value="otros">Otros</option>
                      <option value="nomina">Nómina</option>
                      <option value="alimentacion">Alimentación</option>
                      <option value="transporte">Transporte</option>
                      <option value="ocio">Ocio</option>
                      <option value="compras">Compras</option>
                      <option value="suministros">Suministros</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Concepto
                  </label>

                  <input
                    type="text"
                    value={conceptoTransferencia}
                    onChange={(evento) =>
                      setConceptoTransferencia(evento.target.value)
                    }
                    placeholder="Concepto de la operación"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={realizarOperacion}
                  disabled={procesandoOperacion}
                  className="w-full rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {procesandoOperacion
                    ? "Procesando operación..."
                    : "Confirmar operación"}
                </button>
              </div>
            </section>
          </>
        )}

        {vistaActiva === "divisa" && (
          <>
            <header>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                API externa en tiempo real
              </span>

              <h1 className="mt-5 text-3xl font-bold md:text-4xl">
                Cambio Divisa
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Conversor conectado a una API externa para obtener el último tipo
                de cambio disponible.
              </p>
            </header>

            <section className="mx-auto mt-10 max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
              <div className="bg-gradient-to-r from-violet-600 to-emerald-500 px-8 py-6 text-center">
                <h2 className="text-2xl font-bold text-white">
                  Conversor de Divisas
                </h2>

                <p className="mt-2 text-sm text-emerald-50">
                  EUR → {divisaSeleccionada}
                </p>
              </div>

              <div className="p-8">
                <label className="mb-2 block text-sm font-bold uppercase text-slate-400">
                  Introduce euros (€)
                </label>

                <div className="flex rounded-xl border border-slate-700 bg-slate-950">
                  <span className="flex items-center border-r border-slate-700 px-4 text-lg font-bold text-slate-400">
                    €
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={eurosConversion}
                    onChange={(evento) => setEurosConversion(evento.target.value)}
                    className="w-full rounded-r-xl bg-slate-950 px-4 py-3 text-lg font-bold text-white outline-none"
                  />
                </div>

                <label className="mb-2 mt-6 block text-sm font-bold uppercase text-slate-400">
                  Cambiar a
                </label>

                <select
                  value={divisaSeleccionada}
                  onChange={(evento) =>
                    setDivisaSeleccionada(evento.target.value as Divisa)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                >
                  <option value="USD">{nombresDivisa.USD}</option>
                  <option value="GBP">{nombresDivisa.GBP}</option>
                  <option value="MXN">{nombresDivisa.MXN}</option>
                </select>

                <button
                  type="button"
                  onClick={() => obtenerTasaCambio(divisaSeleccionada)}
                  disabled={cargandoDivisa}
                  className="mt-5 w-full rounded-xl border border-emerald-400 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cargandoDivisa ? "Actualizando cambio..." : "Actualizar cambio"}
                </button>

                {errorDivisa && (
                  <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
                    {errorDivisa}
                  </div>
                )}

                <div className="mt-6 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-400/10 p-6 text-center">
                  <p className="text-sm font-bold uppercase text-slate-400">
                    Valor estimado
                  </p>

                  <p className="mt-3 text-4xl font-bold text-emerald-300">
                    {cargandoDivisa
                      ? "..."
                      : formatearImporte(valorConvertido, divisaSeleccionada)}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-sm font-bold text-slate-300">
                    Tipo de cambio actual
                  </p>

                  <p className="mt-2 text-lg font-bold text-violet-300">
                    {tasaCambio
                      ? `1 EUR = ${tasaCambio.toFixed(4)} ${divisaSeleccionada}`
                      : "Tipo de cambio no disponible"}
                  </p>

                  {fechaCambio && (
                    <p className="mt-2 text-xs text-slate-500">
                      Última fecha publicada por la API: {fechaCambio}
                    </p>
                  )}
                </div>

                <p className="mt-6 text-xs leading-5 text-slate-500">
                  El cambio se obtiene desde una API externa. Los valores son
                  orientativos y corresponden al último dato disponible publicado
                  por el proveedor.
                </p>
              </div>
            </section>
          </>
        )}

        {vistaActiva === "menu" && (
          <>
            <header>
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-200">
                Menú de cliente
              </span>

              <h1 className="mt-5 text-3xl font-bold md:text-4xl">
                Área personal y contratación
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Gestiona tus datos personales y consulta los productos
                disponibles para contratar.
              </p>
            </header>

            <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Área personal</p>

                    <h2 className="mt-2 text-2xl font-bold text-emerald-300">
                      Datos del cliente
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Perfil
                  </span>
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      DNI
                    </label>

                    <input
                      type="text"
                      value={usuario?.dni || ""}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Nombre
                    </label>

                    <input
                      type="text"
                      value={nombrePerfil}
                      onChange={(evento) => setNombrePerfil(evento.target.value)}
                      placeholder="Nombre del cliente"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Apellidos
                    </label>

                    <input
                      type="text"
                      value={apellidosPerfil}
                      onChange={(evento) =>
                        setApellidosPerfil(evento.target.value)
                      }
                      placeholder="Apellidos del cliente"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Email
                    </label>

                    <input
                      type="email"
                      value={emailPerfil}
                      onChange={(evento) => setEmailPerfil(evento.target.value)}
                      placeholder="correo@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-300">
                      Teléfono
                    </label>

                    <input
                      type="text"
                      value={telefonoPerfil}
                      onChange={(evento) =>
                        setTelefonoPerfil(evento.target.value)
                      }
                      placeholder="600000000"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={guardarPerfil}
                    disabled={guardandoPerfil}
                    className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {guardandoPerfil ? "Guardando cambios..." : "Guardar cambios"}
                  </button>
                </div>
              </article>

              <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Contratar</p>

                    <h2 className="mt-2 text-2xl font-bold text-violet-300">
                      Productos disponibles
                    </h2>
                  </div>

                  <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-300">
                    Simulación
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Solicitud de préstamo online preparada visualmente. En una próxima fase se conectará con el backend."
                      )
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-400/10"
                  >
                    <p className="text-lg font-bold text-emerald-300">
                      Préstamo online
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Simula la solicitud de un préstamo personal desde
                      SmartBank AI.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Solicitud de tarjeta preparada visualmente. En una próxima fase se conectará con Django."
                      )
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left transition hover:border-violet-400 hover:bg-violet-400/10"
                  >
                    <p className="text-lg font-bold text-violet-300">
                      Tarjetas
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Contrata una tarjeta de débito, crédito o prepago.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Apertura de cuenta adicional preparada visualmente. Más adelante se conectará con la API."
                      )
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-400/10"
                  >
                    <p className="text-lg font-bold text-emerald-300">
                      Cuenta adicional
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Solicita una nueva cuenta corriente asociada a tu perfil.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Apertura de cuenta de ahorro preparada visualmente. En una próxima fase se podrá crear desde el backend."
                      )
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left transition hover:border-violet-400 hover:bg-violet-400/10"
                  >
                    <p className="text-lg font-bold text-violet-300">
                      Cuenta de ahorro
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Producto orientado al ahorro y organización financiera.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Cuenta de menor preparada visualmente. Más adelante se podrá añadir validación y autorización del tutor."
                      )
                    }
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left transition hover:border-amber-400 hover:bg-amber-400/10"
                  >
                    <p className="text-lg font-bold text-amber-300">
                      Cuenta menor de edad
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Cuenta pensada para menores con supervisión de un adulto.
                    </p>
                  </button>
                </div>
              </article>
            </section>

            <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
              <p className="text-sm text-emerald-200">Próxima evolución</p>

              <h2 className="mt-3 text-2xl font-bold text-emerald-100">
                Contratación conectada con backend
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-6 text-emerald-100/80">
                En próximas fases, estos productos podrán conectarse con modelos
                reales en Django para registrar solicitudes de préstamos,
                tarjetas y nuevas cuentas desde el área cliente.
              </p>
            </section>
          </>
        )}
      </section>
    </main>
  );
}