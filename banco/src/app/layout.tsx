"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { useState, useEffect } from "react"; // Añadimos useEffect para el JS de Bootstrap [cite: 2026-03-06]
import BarraNavegacion from '../components/BarraNavegacion';
import Login from '../components/Login';
import Cargando from '../components/Cargando';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [estaCargando, setEstaCargando] = useState(false);

  // IMPORTANTE: Carga el JS de Bootstrap para que el menú móvil funcione [cite: 2026-03-06]
  useEffect(() => {
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const manejarLogin = (valor: string) => {
    setEstaCargando(true);
    setTimeout(() => {
      setUsuario(valor);
      setEstaCargando(false);
    }, 1500);
  };

  return (
    <html lang="es">
      <body className="bg-light">
        {estaCargando ? (
          <Cargando />
        ) : !usuario ? (
          /* El Login ya es responsivo internamente [cite: 2026-03-06] */
          <Login onLogin={manejarLogin} />
        ) : (
          <>
            <BarraNavegacion onLogout={() => setUsuario(null)} />
            
            {/* MAIN RESPONSIVO: 
              - container-fluid en móvil para máximo espacio.
              - container en escritorio para centrar el contenido.
              - px-3/px-md-0 para márgenes laterales adaptables [cite: 2026-03-06].
            */}
            <main className="container-fluid container-md mt-3 mt-md-4 px-3 px-md-0 pb-5">
              <div className="row justify-content-center">
                <div className="col-12 col-xl-11">
                  {children}
                </div>
              </div>
            </main>
          </>
        )}
      </body>
    </html>
  );
}