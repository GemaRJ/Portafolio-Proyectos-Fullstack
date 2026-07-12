export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-6 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
          SmartBank AI · Proyecto Full-Stack en desarrollo
        </span>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          Backend bancario con Django REST Framework y futuro frontend con IA
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          SmartBank AI es una aplicación bancaria en desarrollo que combina
          backend, APIs REST, autenticación, operaciones financieras y una futura
          capa de inteligencia artificial para analizar ingresos, gastos y hábitos
          de consumo.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/acceso"
            className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Acceder al área cliente
          </a>

          <a
            href="http://127.0.0.1:8000/api/docs/"
            target="_blank"
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
          >
            Ver documentación API
          </a>
        </div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
            <h2 className="text-xl font-semibold text-emerald-300">
              Backend preparado
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              API REST con usuarios, cuentas, movimientos, transferencias,
              autenticación por token, permisos y operaciones bancarias.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
            <h2 className="text-xl font-semibold text-emerald-300">
              Frontend en construcción
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Interfaz moderna con Next.js y TypeScript para acceso, registro,
              panel financiero y operaciones desde el navegador.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
            <h2 className="text-xl font-semibold text-emerald-300">
              IA aplicada
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Próxima evolución: asistente financiero inteligente para analizar
              hábitos, gastos, ingresos y recomendaciones personalizadas.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}