"use client";
import CuentaSaldo from "../components/CuentaSaldo";
import { obtenerDatosSaldo } from "../service/servicioBanco";

export default function PaginaInicio() {
  const datosSaldo = obtenerDatosSaldo();

  return (
    <div className="animate-fade-in py-3 py-md-4 px-2 px-md-0">
      <header className="mb-4 text-center text-md-start">
        <h2 className="fw-bold text-dark display-6 fs-2 fs-md-1">Posición Global</h2>
        <p className="text-muted small">Resumen financiero detallado de tu actividad bancaria.</p>
      </header>

      <div className="main-dashboard-box p-3 p-md-5 rounded-4 shadow-sm border bg-white">
        <div className="row g-4 g-lg-5 align-items-center">
          
          <div className="col-12 col-lg-6">
            <span className="stat-label d-block mb-2 fw-bold text-uppercase small text-secondary">
              Estado de tus cuentas:
            </span>
            
            {/* Bloque de Identidad del Cliente  */}
            <div className="mb-4 p-3 bg-light rounded-3 border-start border-3 border-info">
              <span className="d-block small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>
                Titular Principal
              </span>
              <span className="d-block fw-bold text-dark fs-5">Gema Rodríguez</span>
              <span className="d-block small text-muted">
                Cuenta Corriente acabada en: <strong className="text-primary">1234</strong>
              </span>
            </div>
            
            <CuentaSaldo datos={datosSaldo} />
          </div>

          <div className="col-12 col-lg-6">
            <div className="ps-0 ps-lg-5 mt-2 mt-lg-0">
              <h5 className="fw-bold mb-3 mb-md-4 text-primary">Detalle de Operaciones</h5>
              <p className="small text-muted mb-4">
                Tu sistema contable refleja las retenciones por compras con tarjeta que aún no han sido liquidadas por el comercio. Estas retenciones se muestran como movimientos pendientes en tu cuenta, lo que puede generar una aparente discrepancia entre el saldo disponible y el saldo real. Ten en cuenta que estas retenciones se liberarán una vez que el comercio procese la transacción, momento en el cual el saldo disponible se ajustará automáticamente
              </p>
              
              <div className="p-3 bg-light rounded-4 border-start border-4 border-primary shadow-sm">
                <span className="d-block fw-bold small text-dark mb-1">Nota de seguridad</span>
                <span className="small text-muted d-block lh-sm">
                  Si detectas alguna actividad inusual, contacta de inmediato al departamento de Ciberseguridad: 
                  <strong className="text-primary d-block d-md-inline ms-md-1">911 111 111</strong>
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}