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

const accionesIniciales: AccionChat[] = [
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
    texto: "Analizar ahorro",
    pregunta: "Dame una recomendación de ahorro",
  },
];

function obtenerHoraActual() {
  return new Date().toLocaleTimeString("es-ES", {
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
  id: "inicio",
  autor: "bot",
  texto:
    "Hola. Soy el asistente financiero de SmartBank AI. Puedo ayudarte a consultar y entender tus datos bancarios. Puedes escribirme directamente o utilizar uno de estos accesos.",
  fecha: obtenerHoraActual(),
  acciones: accionesIniciales,
};

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
    if (typeof window === "undefined") return null;

    return localStorage.getItem("token_smartbank");
  };

  const agregarMensaje = (
    autor: AutorMensaje,
    texto: string,
    acciones?: AccionChat[]
  ) => {
    setMensajes((actuales) => [
      ...actuales,
      {
        id: `${autor}-${Date.now()}-${Math.random()}`,
        autor,
        texto,
        fecha: obtenerHoraActual(),
        acciones,
      },
    ]);
  };

  const leerRespuesta = async (
    respuesta: Response
  ): Promise<RespuestaAsistente> => {
    const contenido = await respuesta.text();

    if (!contenido) return {};

    try {
      return JSON.parse(contenido);
    } catch {
      throw new Error("El asistente no ha podido interpretar la respuesta.");
    }
  };

  const obtenerMensajeError = (datos: RespuestaAsistente) => {
    if (datos.detail) return datos.detail;

    if (Array.isArray(datos.pregunta)) {
      return datos.pregunta[0];
    }

    if (typeof datos.pregunta === "string") {
      return datos.pregunta;
    }

    if (datos.non_field_errors?.[0]) {
      return datos.non_field_errors[0];
    }

    return "No he podido completar la consulta.";
  };

  const interpretarPregunta = (textoOriginal: string) => {
    const texto = normalizarTexto(textoOriginal);

    // SALUDOS
    if (
      [
        "hola",
        "buenas",
        "buenos dias",
        "buenas tardes",
        "buenas noches",
        "hey",
        "ey",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: true,
        respuesta:
          "Hola de nuevo. Puedo ayudarte con tu saldo, ingresos, gastos, categorías de consumo o darte una orientación de ahorro.",
        acciones: accionesIniciales,
      };
    }

    // AYUDA
    if (
      [
        "ayuda",
        "que puedes hacer",
        "que sabes hacer",
        "para que sirves",
        "como me ayudas",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: true,
        respuesta:
          "Puedo analizar la información de tus cuentas y movimientos: saldo total, gastos del mes, ingresos, categoría con mayor consumo y capacidad de ahorro.",
        acciones: accionesIniciales,
      };
    }

    // SALDO
    if (
      [
        "saldo",
        "cuanto dinero tengo",
        "cuanto tengo",
        "dinero disponible",
        "saldo disponible",
        "dinero en mis cuentas",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: false,
        backend: "¿Cuál es mi saldo total?",
        acciones: [
          {
            texto: "Ver gastos",
            pregunta: "¿Cuánto he gastado este mes?",
          },
          {
            texto: "Ver ingresos",
            pregunta: "¿Cuánto he ingresado este mes?",
          },
        ],
      };
    }

    // GASTOS
    if (
      [
        "gasto",
        "gastos",
        "gastado",
        "cuanto he gastado",
        "mis gastos",
        "que he gastado",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: false,
        backend: "¿Cuánto he gastado este mes?",
        acciones: [
          {
            texto: "¿Dónde gasto más?",
            pregunta: "¿En qué categoría gasto más?",
          },
          {
            texto: "Consejo de ahorro",
            pregunta: "Dame una recomendación de ahorro",
          },
        ],
      };
    }

    // INGRESOS
    if (
      [
        "ingreso",
        "ingresos",
        "ingresado",
        "cuanto he ingresado",
        "mis ingresos",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: false,
        backend: "¿Cuánto he ingresado este mes?",
        acciones: [
          {
            texto: "Comparar con gastos",
            pregunta: "¿Cuánto he gastado este mes?",
          },
          {
            texto: "Analizar ahorro",
            pregunta: "Dame una recomendación de ahorro",
          },
        ],
      };
    }

    // CATEGORÍA
    if (
      [
        "categoria",
        "donde gasto mas",
        "en que gasto mas",
        "mayor gasto",
        "gasto principal",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: false,
        backend: "¿En qué categoría gasto más?",
        acciones: [
          {
            texto: "Consejo de ahorro",
            pregunta: "Dame una recomendación de ahorro",
          },
        ],
      };
    }

    // AHORRO
    if (
      [
        "ahorro",
        "ahorrar",
        "recomendacion",
        "consejo",
        "como puedo ahorrar",
      ].some((valor) => texto.includes(valor))
    ) {
      return {
        local: false,
        backend: "Dame una recomendación de ahorro",
        acciones: [
          {
            texto: "Ver gastos",
            pregunta: "¿Cuánto he gastado este mes?",
          },
          {
            texto: "Categoría principal",
            pregunta: "¿En qué categoría gasto más?",
          },
        ],
      };
    }

    // AGRADECIMIENTOS
    if (
      ["gracias", "perfecto", "genial", "muy bien"].some((valor) =>
        texto.includes(valor)
      )
    ) {
      return {
        local: true,
        respuesta:
          "Encantado de ayudarte. Si quieres, podemos seguir revisando tus finanzas.",
      };
    }

    // DESPEDIDA
    if (
      ["adios", "hasta luego", "nos vemos", "chao"].some((valor) =>
        texto.includes(valor)
      )
    ) {
      return {
        local: true,
        respuesta:
          "Hasta pronto. Cuando quieras volver a revisar tus finanzas, aquí estaré.",
      };
    }

    return {
      local: true,
      respuesta:
        "No he entendido del todo la consulta. Prueba a preguntarme por tu saldo, gastos, ingresos, ahorro o categoría principal.",
      acciones: accionesIniciales,
    };
  };

  const consultarBackend = async (
    pregunta: string,
    acciones?: AccionChat[]
  ) => {
    const token = obtenerToken();

    if (!token) {
      agregarMensaje(
        "bot",
        "Tu sesión no está disponible. Inicia sesión de nuevo para poder consultar los datos financieros."
      );
      return;
    }

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
          "He recibido la consulta, pero no he podido obtener los datos.",
        acciones
      );
    } catch {
      agregarMensaje(
        "bot",
        "No he podido conectar con el servicio financiero. Inténtalo de nuevo en unos segundos."
      );
    }
  };

  const enviarMensaje = async (textoRecibido?: string) => {
    const texto = textoRecibido ?? mensajeUsuario;

    if (!texto.trim() || cargando) return;

    agregarMensaje("usuario", texto.trim());

    setMensajeUsuario("");
    setCargando(true);

    const interpretacion = interpretarPregunta(texto);

    await new Promise((resolve) => setTimeout(resolve, 650));

    if (interpretacion.local) {
      agregarMensaje(
        "bot",
        interpretacion.respuesta ?? "",
        interpretacion.acciones
      );

      setCargando(false);
      return;
    }

    await consultarBackend(
      interpretacion.backend ?? texto,
      interpretacion.acciones
    );

    setCargando(false);
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
        onClick={() => setAbierto((actual) => !actual)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-emerald-400 text-white shadow-xl shadow-violet-500/20 transition duration-300 hover:scale-105"
        aria-label="Abrir asistente financiero"
      >
        {abierto ? <X size={21} /> : <MessageSquare size={21} />}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.aside
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 24,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 24,
            }}
            transition={{
              duration: 0.22,
            }}
            className="fixed bottom-24 right-6 z-50 flex h-[540px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl shadow-violet-500/20"
          >
            {/* CABECERA */}
            <header className="bg-gradient-to-r from-violet-600 to-emerald-500 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                    <Bot size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                      SmartBank AI
                    </p>

                    <h2 className="text-base font-bold text-white">
                      Asistente financiero
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" />

                      <span className="text-[11px] text-white/80">
                        En línea
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
                  aria-label="Cerrar asistente"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* MENSAJES */}
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
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        mensaje.autor === "usuario"
                          ? "bg-slate-700"
                          : "bg-gradient-to-br from-violet-600 to-emerald-400"
                      }`}
                    >
                      {mensaje.autor === "usuario" ? (
                        <User size={11} />
                      ) : (
                        <Bot size={11} />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                        mensaje.autor === "usuario"
                          ? "rounded-tr-none bg-emerald-400 text-slate-950"
                          : "rounded-tl-none border border-slate-800 bg-slate-900 text-slate-100"
                      }`}
                    >
                      {mensaje.texto}
                    </div>
                  </div>

                  {mensaje.acciones && mensaje.acciones.length > 0 && (
                    <div className="ml-8 mt-2 flex max-w-[82%] flex-wrap gap-2">
                      {mensaje.acciones.map((accion) => (
                        <button
                          key={`${mensaje.id}-${accion.texto}`}
                          type="button"
                          onClick={() => enviarMensaje(accion.pregunta)}
                          disabled={cargando}
                          className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                        >
                          {accion.texto}

                          <ArrowRight size={9} />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="mt-1 px-8 text-[10px] text-slate-600">
                    {mensaje.fecha}
                  </span>
                </div>
              ))}

              {/* ESCRIBIENDO */}
              {cargando && (
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-emerald-400">
                    <Bot size={11} />
                  </div>

                  <div className="flex gap-1 rounded-2xl rounded-tl-none border border-slate-800 bg-slate-900 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  </div>
                </div>
              )}

              <div ref={finMensajesRef} />
            </div>

            {/* INPUT */}
            <footer className="border-t border-slate-800 bg-slate-900/95 p-3">
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
                    setMensajeUsuario(evento.target.value)
                  }
                  placeholder="Pregunta sobre tus finanzas..."
                  disabled={cargando}
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={cargando || !mensajeUsuario.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Enviar"
                >
                  <Send size={16} />
                </button>
              </form>

              <button
                type="button"
                onClick={reiniciarChat}
                className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-600 transition hover:text-slate-400"
              >
                <RotateCcw size={11} />
                Reiniciar conversación
              </button>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}