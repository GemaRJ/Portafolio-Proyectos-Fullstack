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

type MensajeChat = {
  id: string;
  autor: AutorMensaje;
  texto: string;
  fecha: string;
};

type RespuestaAsistente = {
  respuesta?: string;
  detail?: string;
  pregunta?: string | string[];
  non_field_errors?: string[];
};

const preguntasRapidas = [
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

const mensajeInicial: MensajeChat = {
  id: "mensaje-inicial",
  autor: "bot",
  texto:
    "¡Hola! Soy el asistente financiero de SmartBank AI. Puedo consultar tu saldo, ingresos, gastos y hábitos financieros.",
  fecha: obtenerHoraActual(),
};

function obtenerHoraActual() {
  const fecha = new Date();

  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatbotFinanciero() {
  const [abierto, setAbierto] = useState(false);
  const [mensajeUsuario, setMensajeUsuario] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([mensajeInicial]);

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

  const agregarMensaje = (autor: AutorMensaje, texto: string) => {
    setMensajes((mensajesActuales) => [
      ...mensajesActuales,
      {
        id: `${autor}-${Date.now()}-${Math.random()}`,
        autor,
        texto,
        fecha: obtenerHoraActual(),
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

  const consultarAsistente = async (preguntaRecibida: string) => {
    const pregunta = preguntaRecibida.trim();

    if (!pregunta || cargando) {
      return;
    }

    const token = obtenerToken();

    if (!token) {
      agregarMensaje(
        "bot",
        "Tu sesión no está disponible. Vuelve a iniciar sesión para consultar tus datos financieros."
      );
      return;
    }

    agregarMensaje("usuario", pregunta);
    setMensajeUsuario("");
    setCargando(true);

    try {
      const respuesta = await fetch(RUTAS_API.asistenteConsulta, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          pregunta,
        }),
      });

      const datos = await leerRespuesta(respuesta);

      if (!respuesta.ok) {
        agregarMensaje("bot", obtenerMensajeError(datos));
        return;
      }

      agregarMensaje(
        "bot",
        datos.respuesta ||
          "He recibido la consulta, pero no he podido generar una respuesta."
      );

      setTimeout(() => {
        agregarMensaje(
          "bot",
          "¿Deseas realizar otra consulta? Puedes escribirla o utilizar uno de los accesos rápidos."
        );
      }, 450);
    } catch (errorDesconocido) {
      agregarMensaje(
        "bot",
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se ha podido conectar con el asistente financiero. Inténtalo de nuevo en unos segundos."
      );
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = () => {
    void consultarAsistente(mensajeUsuario);
  };

  const reiniciarChat = () => {
    setMensajes([
      {
        ...mensajeInicial,
        id: `mensaje-inicial-${Date.now()}`,
        fecha: obtenerHoraActual(),
      },
    ]);

    setMensajeUsuario("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((estadoActual) => !estadoActual)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-emerald-400 text-white shadow-2xl shadow-emerald-500/25 transition duration-300 hover:scale-105"
        aria-label={abierto ? "Cerrar chatbot" : "Abrir chatbot financiero"}
        title="Asistente financiero"
      >
        {abierto ? <X size={22} /> : <MessageSquare size={22} />}
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
            <header className="border-b border-white/10 bg-gradient-to-r from-violet-600 to-emerald-500 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
                    <Bot size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-50">
                      SmartBank AI
                    </p>

                    <h2 className="text-base font-bold text-white">
                      Asistente financiero
                    </h2>

                    <p className="mt-0.5 text-xs text-emerald-50/90">
                      Conectado a tus datos bancarios
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                  aria-label="Cerrar chatbot"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                    className={`flex max-w-[88%] items-start gap-2 ${
                      mensaje.autor === "usuario"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
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
                          : "rounded-tl-none border border-slate-800 bg-slate-900 text-slate-100"
                      }`}
                    >
                      {mensaje.texto}
                    </div>
                  </div>

                  <span className="mt-1 px-8 text-[10px] text-slate-500">
                    {mensaje.fecha}
                  </span>
                </div>
              ))}

              {!cargando && (
                <div className="ml-8 max-w-[88%]">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Consultas rápidas
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {preguntasRapidas.map((opcion) => (
                      <button
                        key={opcion.texto}
                        type="button"
                        onClick={() =>
                          void consultarAsistente(opcion.pregunta)
                        }
                        className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                      >
                        {opcion.texto}
                        <ArrowRight size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {cargando && (
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-emerald-400 text-white">
                    <Bot size={12} />
                  </div>

                  <div className="rounded-2xl rounded-tl-none border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    Analizando tus datos financieros
                    <span className="ml-1 animate-pulse">...</span>
                  </div>
                </div>
              )}

              <div ref={finMensajesRef} />
            </div>

            <footer className="border-t border-slate-800 bg-slate-900/95 p-3">
              <form
                onSubmit={(evento) => {
                  evento.preventDefault();
                  enviarMensaje();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={mensajeUsuario}
                  onChange={(evento) =>
                    setMensajeUsuario(evento.target.value)
                  }
                  placeholder="Escribe tu consulta..."
                  disabled={cargando}
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={cargando || !mensajeUsuario.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Enviar consulta"
                >
                  <Send size={17} />
                </button>
              </form>

              <button
                type="button"
                onClick={reiniciarChat}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-violet-300"
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