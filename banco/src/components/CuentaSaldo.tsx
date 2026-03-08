"use client";
import Link from 'next/link';

interface Props {
  datos: {
    contable: number;
    disponible: number;
    retenciones: number;
  }
}

export default function CuentaSaldo({ datos }: Props) {
  return (
    <Link href="/movimientos" className="text-decoration-none d-block shadow-hover">
      {/* Ajustamos el padding (p-3 p-md-4) para que en móvil no sea tan masivo [cite: 2026-03-06] */}
      <div className="card shadow-lg border-0 rounded-4 mb-4 text-white overflow-hidden" 
           style={{ 
             background: 'linear-gradient(135deg, #0052cc 0%, #002e73 100%)', 
             transition: 'transform 0.2s ease-in-out' 
           }}>
        <div className="card-body p-3 p-md-4">
          <header className="mb-2 mb-md-3">
            <span className="stat-label text-white opacity-75 d-block mb-1 fw-medium" style={{fontSize: '0.75rem'}}>
              SALDO DISPONIBLE:
            </span>
            {/* fs-2 en móvil y display-5 en PC para que el símbolo € no se corte [cite: 2026-03-06] */}
            <h1 className="fw-bold m-0 fs-2 fs-md-1 display-md-5 text-nowrap">
              {datos.disponible.toLocaleString('es-ES')} €
            </h1>
          </header>
          
          {/* Fila de detalles: col-12 en móviles muy pequeños para evitar solapamientos [cite: 2026-03-06] */}
          <div className="row g-2 border-top border-white border-opacity-25 pt-3 mt-2">
            <div className="col-6 col-sm-6 border-end border-white border-opacity-25">
              <span className="small opacity-75 d-block mb-1" style={{fontSize: '0.65rem'}}>CONTABLE:</span>
              <span className="fw-bold d-block fs-6">
                {datos.contable.toLocaleString('es-ES')} €
              </span>
            </div>
            <div className="col-6 col-sm-6 ps-3">
              <span className="small opacity-75 d-block mb-1" style={{fontSize: '0.65rem'}}>RETENCIONES DE TARJETA:</span>
              <span className="fw-bold text-warning d-block fs-6">
                -{datos.retenciones.toLocaleString('es-ES')} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}