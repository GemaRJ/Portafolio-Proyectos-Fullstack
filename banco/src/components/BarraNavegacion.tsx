"use client";
import Link from 'next/link';

interface Props { 
  onLogout: () => void; 
}

export default function BarraNavegacion({ onLogout }: Props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2 py-md-3">
      <div className="container">
        {/* Logo responsivo: Ajusta su tamaño en pantallas pequeñas */}
        <Link href="/" className="navbar-brand fw-bold text-info fs-4 fs-md-3">
          Banca Segura
        </Link>

        {/* Botón Hamburguesa: Mejorado con bordes suaves */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor colapsable: Añadimos un pequeño margen superior en móvil*/}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-3 mb-lg-0 mt-3 mt-lg-0">
            <li className="nav-item">
              <Link href="/" className="nav-link px-lg-3 py-2 text-center text-lg-start">Resumen</Link>
            </li>
            <li className="nav-item">
              <Link href="/movimientos" className="nav-link px-lg-3 py-2 text-center text-lg-start">Movimientos</Link>
            </li>
            <li className="nav-item">
              <Link href="/transferencia" className="nav-link px-lg-3 py-2 text-center text-lg-start">Transferencia</Link>
            </li>
            <li className="nav-item">
              <Link href="/cambio" className="nav-link px-lg-3 py-2 text-center text-lg-start">Cambio Divisa</Link>
            </li>
          </ul>
          
          {/* Botón de cierre: d-grid lo hace ancho completo en móvil */}
          <div className="d-grid d-lg-block border-top border-secondary border-opacity-25 pt-3 pt-lg-0">
            <button 
              className="btn btn-outline-info btn-sm rounded-pill px-4 fw-bold py-2 py-lg-1" 
              onClick={onLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}