"use client";

import { useEffect, useRef, useState } from "react";
import { RUTAS_API } from "@/servicios/api";

type AutorMensaje = "bot" | "usuario";

type MensajeChat = {
  id: number;
  autor: AutorMensaje;
  texto: string;
};

type RespuestaAsistente = {
  respuesta?: string;
  detail?: string;
  pregunta?: string | string[];
  non_field_errors?: string[];
};

const preguntasRapidas = [
  "Consultar mi saldo total",
  "Ver cuánto he gastado este mes",
  "Ver cuánto he ingresado este mes",
  "Dame una recomendación de ahorro",
  "Ver en qué categoría gasto más",
];

export default function ChatbotFinanciero() {
  const [abierto, setAbierto] = useState(false);
  const [mensajeUsuario, setMensajeUsuario] = useState("");
  const [cargando, setCargando] = useState(false);

  const contenedorMensajesRef = useRef<HTMLDivElement | null>(null);

  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: 1,
      autor: "bot",
      texto:
        "Hola, bienvenida a SmartBank AI. Soy tu asistente financiero inteligente.",
    },
  ]);

  useEffect(() => {
    if (contenedorMensajesRef.current) {
      contenedorMensajesRef.current.scrollTop =
        contenedorMensajesRef.current.scrollHeight;
    }
  }, [mensajes, cargando]);

  const obtenerToken = () => {
    return localStorage.getItem("token_smartbank");
  };

  const agregarMensaje = (autor: AutorMensaje, texto: string) => {
    setMensajes((mensajesActuales) => [
      ...mensajesActuales,
      {
        id: Date.now() + Math.random(),
        autor,
        texto,
      },
    ]);
  };

  const traducirPreguntaRapida = (pregunta: string) => {
    if (pregunta === "Consultar mi saldo total") {
      return "¿Cuál es mi saldo total?";
    }

    if (pregunta === "Ver cuánto he gastado este mes") {
      return "¿Cuánto he gastado este mes?";
    }

    if (pregunta === "Ver cuánto he ingresado este mes") {
      return "¿Cuánto he ingresado este mes?";
    }

    if (pregunta === "Dame una recomendación de ahorro") {
      return "Dame una recomendación de ahorro";
    }

    if (pregunta === "Ver en qué categoría gasto más") {
      return "¿En qué categoría gasto más?";
    }

    return pregunta;
  };

  const obtenerMensajeError = (datos: RespuestaAsistente) => {
    if (datos.detail) {
      return datos.detail;
    }

    if (Array.isArray(datos.pregunta)) {
      return datos.pregunta[0];
    }

    if (datos.non_field_errors?.[0]) {
      return datos.non_field_errors[0];
    }

    return "No he podido consultar el asistente financiero.";
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
        "No he encontrado una sesión activa. Vuelve a iniciar sesión para que pueda consultar tus datos financieros."
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

      const datos: RespuestaAsistente = await respuesta.json();

      if (!respuesta.ok) {
        agregarMensaje("bot", obtenerMensajeError(datos));
        return;
      }

      agregarMensaje(
        "bot",
        datos.respuesta ||
          "He recibido tu consulta, pero no he podido generar una respuesta."
      );

      setTimeout(() => {
        agregarMensaje(
          "bot",
          "¿Deseas consultar algo más? Puedes marcar una opción o escribir tu propia consulta."
        );
      }, 500);
    } catch {
      agregarMensaje(
        "bot",
        "No he podido conectar con Django. Comprueba que el backend esté arrancado con el entorno virtual activo."
      );
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = () => {
    consultarAsistente(mensajeUsuario);
  };

  const responderPreguntaRapida = (pregunta: string) => {
    consultarAsistente(traducirPreguntaRapida(pregunta));
  };

  const reiniciarChat = () => {
    setMensajes([
      {
        id: 1,
        autor: "bot",
        texto:
          "Hola de nuevo, bienvenida a SmartBank AI. Soy tu asistente financiero inteligente.",
      },
    ]);

    setMensajeUsuario("");
  };

  return (
    <>
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-2xl font-bold text-white shadow-2xl shadow-emerald-500/30 transition hover:scale-105"
          aria-label="Abrir chatbot financiero"
        >
          IA
        </button>
      )}

      {abierto && (
        <aside className="fixed bottom-6 right-6 z-50 flex h-[620px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl shadow-violet-500/20">
          <header className="bg-gradient-to-r from-violet-600 to-emerald-500 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-50">
                  SmartBank AI
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  Chatbot financiero
                </h2>

                <p className="mt-1 text-xs text-emerald-50/90">
                  Conectado al asistente propio de Django
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-white transition hover:bg-white/25"
                aria-label="Cerrar chatbot"
              >
                ×
              </button>
            </div>
          </header>

          <div
            ref={contenedorMensajesRef}
            className="flex-1 space-y-4 overflow-y-auto bg-slate-950 p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`flex ${
                  mensaje.autor === "usuario" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    mensaje.autor === "usuario"
                      ? "bg-emerald-400 text-slate-950"
                      : "border border-slate-800 bg-slate-900 text-slate-100"
                  }`}
                >
                  {mensaje.texto}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                ¿Qué deseas consultar?
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {preguntasRapidas.map((pregunta) => (
                  <button
                    key={pregunta}
                    type="button"
                    onClick={() => responderPreguntaRapida(pregunta)}
                    disabled={cargando}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pregunta}
                  </button>
                ))}
              </div>
            </div>

            {cargando && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-100">
                  Analizando tus datos financieros...
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-slate-800 bg-slate-900/90 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={mensajeUsuario}
                onChange={(evento) => setMensajeUsuario(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter") {
                    enviarMensaje();
                  }
                }}
                placeholder="Escribe tu consulta..."
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />

              <button
                type="button"
                onClick={enviarMensaje}
                disabled={cargando}
                className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Enviar
              </button>
            </div>

            <button
              type="button"
              onClick={reiniciarChat}
              className="mt-3 text-xs font-semibold text-slate-500 transition hover:text-violet-300"
            >
              Reiniciar conversación
            </button>
          </footer>
        </aside>
      )}
    </>
  );
}