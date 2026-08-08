"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  RotateCcw,
  Send,
  User,
  X,
} from "lucide-react";

import { RUTAS_API } from "@/servicios/api";

type AutorMensaje = "bot" | "usuario";

type AccionChat = {
  texto: string;
  pregunta: string;
};

type MensajeChat = {
  id: string;
  autor: AutorMensaje;
  texto: string;
  fecha: string;
  acciones?: AccionChat[];
};

type RespuestaAsistente = {
  respuesta?: string;
  detail?: string;
  pregunta?: string | string[];
  non_field_errors?: string[];
};

const accionesPrincipales: AccionChat[] = [
  {
    texto: "Consultar saldo",
    pregunta: "¿Cuál es mi saldo total?",
  },
  {
    texto: "Gastos del mes",
    pregunta: "¿Cuánto he gastado este mes?",
  },
  {
    texto: "Ingresos del mes",
    pregunta: "¿Cuánto he ingresado este mes?",
  },
  {
    texto: "Consejo de ahorro",
    pregunta: "Dame una recomendación de ahorro",
  },
  {
    texto: "Categoría principal",
    pregunta: "¿En qué categoría gasto más?",
  },
];

function obtenerHoraActual() {
  const fecha = new Date();

  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:]/g, "")
    .trim();
}

const mensajeInicial: MensajeChat = {
  id: "mensaje-inicial",
  autor: "bot",
  texto:
    "¡Hola! Soy el asistente financiero de SmartBank AI. Puedes escribirme con total libertad o utilizar los accesos rápidos. Puedo consultar tu saldo, gastos, ingresos y ayudarte a analizar tus hábitos financieros.",
  fecha: obtenerHoraActual(),
  acciones: accionesPrincipales,
};

export default function ChatbotFinanciero() {
  const [abierto, setAbierto] = useState(false);
  const [mensajeUsuario, setMensajeUsuario] = useState("");
  const [cargando, setCargando] = useState(false);

  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    mensajeInicial,
  ]);

  const finMensajesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensajes, cargando]);

  const obtenerToken = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem("token_smartbank");
  };

  const agregarMensaje = (
    autor: AutorMensaje,
    texto: string,
    acciones?: AccionChat[]
  ) => {
    setMensajes((mensajesActuales) => [
      ...mensajesActuales,
      {
        id: `${autor}-${Date.now()}-${Math.random()}`,
        autor,
        texto,
        fecha: obtenerHoraActual(),
        acciones,
      },
    ]);
  };

  const obtenerMensajeError = (datos: RespuestaAsistente) => {
    if (datos.detail) {
      return datos.detail;
    }

    if (Array.isArray(datos.pregunta) && datos.pregunta[0]) {
      return datos.pregunta[0];
    }

    if (typeof datos.pregunta === "string") {
      return datos.pregunta;
    }

    if (datos.non_field_errors?.[0]) {
      return datos.non_field_errors[0];
    }

    return "No he podido procesar la consulta financiera.";
  };

  const leerRespuesta = async (
    respuesta: Response
  ): Promise<RespuestaAsistente> => {
    const contenido = await respuesta.text();

    if (!contenido) {
      return {};
    }

    try {
      return JSON.parse(contenido) as RespuestaAsistente;
    } catch {
      throw new Error(
        `El servidor respondió con un formato inesperado (${respuesta.status}).`
      );
    }
  };

  const procesarRespuestaLocal = (
    preguntaOriginal: string
  ): {
    texto: string;
    acciones?: AccionChat[];
    usarBackend?: boolean;
    preguntaBackend?: string;
  } => {
    const pregunta = normalizarTexto(preguntaOriginal);

    // Saludos
    if (
      [
        "hola",
        "buenas",
        "buenos dias",
        "buenas tardes",
        "buenas noches",
        "hey",
        "ey",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto:
          "¡Hola! Encantado de ayudarte. Puedes preguntarme por tu saldo, tus gastos, tus ingresos o pedirme una recomendación de ahorro.",
        acciones: accionesPrincipales,
      };
    }

    // Ayuda
    if (
      [
        "ayuda",
        "que puedes hacer",
        "que sabes hacer",
        "como puedes ayudarme",
        "opciones",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto:
          "Puedo consultar tus datos bancarios en tiempo real. Por ejemplo, puedo decirte cuánto saldo tienes, cuánto has gastado o ingresado este mes, qué categoría concentra más gasto y darte una recomendación de ahorro.",
        acciones: accionesPrincipales,
      };
    }

    // Saldo
    if (
      [
        "saldo",
        "cuanto dinero tengo",
        "dinero disponible",
        "cuanto tengo",
        "saldo total",
        "dinero en mis cuentas",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto: "",
        usarBackend: true,
        preguntaBackend: "¿Cuál es mi saldo total?",
      };
    }

    // Gastos
    if (
      [
        "cuanto he gastado",
        "gastos",
        "he gastado",
        "gasto este mes",
        "mis gastos",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto: "",
        usarBackend: true,
        preguntaBackend: "¿Cuánto he gastado este mes?",
      };
    }

    // Ingresos
    if (
      [
        "cuanto he ingresado",
        "ingresos",
        "he ingresado",
        "ingreso este mes",
        "mis ingresos",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto: "",
        usarBackend: true,
        preguntaBackend: "¿Cuánto he ingresado este mes?",
      };
    }

    // Categoría
    if (
      [
        "categoria",
        "en que gasto mas",
        "donde gasto mas",
        "mayor gasto",
        "categoria principal",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto: "",
        usarBackend: true,
        preguntaBackend: "¿En qué categoría gasto más?",
      };
    }

    // Ahorro
    if (
      [
        "ahorro",
        "recomendacion",
        "consejo",
        "como puedo ahorrar",
        "puedo ahorrar",
      ].some((texto) => pregunta.includes(texto))
    ) {
      return {
        texto: "",
        usarBackend: true,
        preguntaBackend: "Dame una recomendación de ahorro",
      };
    }

    // Gracias
    if (
      ["gracias", "muchas gracias", "perfecto", "genial"].some((texto) =>
        pregunta.includes(texto)
      )
    ) {
      return {
        texto:
          "¡De nada! Si quieres, puedo seguir analizando tus datos financieros.",
        acciones: accionesPrincipales,
      };
    }

    // Despedida
    if (
      ["adios", "hasta luego", "nos vemos", "chao"].some((texto) =>
        pregunta.includes(texto)
      )
    ) {
      return {
        texto:
          "Hasta pronto. Cuando quieras volver a revisar tus finanzas, aquí estaré.",
      };
    }

    return {
      texto:
        "No he entendido del todo tu pregunta. Puedes preguntarme por tu saldo, gastos, ingresos, ahorro o la categoría en la que más gastas.",
      acciones: accionesPrincipales,
    };
  };

  const consultarBackend = async (
    preguntaBackend: string
  ) => {
    const token = obtenerToken();

    if (!token) {
      agregarMensaje(
        "bot",
        "No encuentro una sesión activa. Vuelve a iniciar sesión para poder consultar tus datos financieros."
      );

      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(
        RUTAS_API.asistenteConsulta,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            pregunta: preguntaBackend,
          }),
        }
      );

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        agregarMensaje(
          "bot",
          obtenerMensajeError(datos)
        );
        return;
      }

      agregarMensaje(
        "bot",
        datos.respuesta ||
          "He recibido la consulta, pero no he podido obtener una respuesta.",
        accionesPrincipales
      );
    } catch {
      agregarMensaje(
        "bot",
        "No he podido conectar con el asistente financiero. Inténtalo de nuevo en unos segundos."
      );
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async (
    textoRecibido?: string
  ) => {
    const texto =
      textoRecibido ?? mensajeUsuario;

    if (!texto.trim() || cargando) {
      return;
    }

    agregarMensaje(
      "usuario",
      texto.trim()
    );

    setMensajeUsuario("");
    setCargando(true);

    const respuestaLocal =
      procesarRespuestaLocal(texto);

    setTimeout(async () => {
      if (
        respuestaLocal.usarBackend &&
        respuestaLocal.preguntaBackend
      ) {
        setCargando(false);

        await consultarBackend(
          respuestaLocal.preguntaBackend
        );

        return;
      }

      agregarMensaje(
        "bot",
        respuestaLocal.texto,
        respuestaLocal.acciones
      );

      setCargando(false);
    }, 650);
  };

  const reiniciarChat = () => {
    setMensajes([
      {
        ...mensajeInicial,
        id: `inicio-${Date.now()}`,
        fecha: obtenerHoraActual(),
      },
    ]);

    setMensajeUsuario("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setAbierto((estado) => !estado)
        }
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-emerald-400 text-white shadow-2xl transition hover:scale-105"
      >
        {abierto ? (
          <X size={22} />
        ) : (
          <MessageSquare size={22} />
        )}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.aside
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 35,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 35,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl shadow-violet-500/20"
          >
            <header className="bg-gradient-to-r from-violet-600 to-emerald-500 px-4 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                    <Bot size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase">
                      SmartBank AI
                    </p>

                    <h2 className="font-bold">
                      Asistente financiero
                    </h2>

                    <p className="text-xs text-white/80">
                      Conectado a tus datos bancarios
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAbierto(false)
                  }
                  className="rounded-full bg-white/15 p-2"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {mensajes.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`flex flex-col ${
                    mensaje.autor === "usuario"
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[88%] gap-2 ${
                      mensaje.autor === "usuario"
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        mensaje.autor === "usuario"
                          ? "bg-slate-600"
                          : "bg-gradient-to-br from-violet-600 to-emerald-400"
                      }`}
                    >
                      {mensaje.autor === "usuario" ? (
                        <User size={12} />
                      ) : (
                        <Bot size={12} />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        mensaje.autor === "usuario"
                          ? "rounded-tr-none bg-emerald-400 text-slate-950"
                          : "rounded-tl-none border border-slate-800 bg-slate-900"
                      }`}
                    >
                      {mensaje.texto}
                    </div>
                  </div>

                  {mensaje.acciones && (
                    <div className="ml-8 mt-2 flex max-w-[85%] flex-wrap gap-2">
                      {mensaje.acciones.map(
                        (accion) => (
                          <button
                            key={accion.texto}
                            type="button"
                            onClick={() =>
                              enviarMensaje(
                                accion.pregunta
                              )
                            }
                            className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold transition hover:border-emerald-400 hover:text-emerald-300"
                          >
                            {accion.texto}

                            <ArrowRight
                              size={10}
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}

                  <span className="mt-1 px-8 text-[10px] text-slate-500">
                    {mensaje.fecha}
                  </span>
                </div>
              ))}

              {cargando && (
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-emerald-400">
                    <Bot size={12} />
                  </div>

                  <div className="rounded-2xl rounded-tl-none border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
                    Analizando tu consulta
                    <span className="animate-pulse">
                      ...
                    </span>
                  </div>
                </div>
              )}

              <div ref={finMensajesRef} />
            </div>

            <footer className="border-t border-slate-800 bg-slate-900 p-3">
              <form
                onSubmit={(evento) => {
                  evento.preventDefault();
                  void enviarMensaje();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={mensajeUsuario}
                  onChange={(evento) =>
                    setMensajeUsuario(
                      evento.target.value
                    )
                  }
                  placeholder="Escribe tu consulta..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />

                <button
                  type="submit"
                  disabled={
                    cargando ||
                    !mensajeUsuario.trim()
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 disabled:opacity-50"
                >
                  <Send size={17} />
                </button>
              </form>

              <button
                type="button"
                onClick={reiniciarChat}
                className="mt-3 flex items-center gap-1 text-xs text-slate-500"
              >
                <RotateCcw size={12} />
                Reiniciar conversación
              </button>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}