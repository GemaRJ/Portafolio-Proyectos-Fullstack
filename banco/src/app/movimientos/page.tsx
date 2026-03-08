"use client";
import { obtenerMovimientosConSaldo } from "../../service/servicioBanco";

export default function PaginaMovimientos() {
  const listaOriginal = obtenerMovimientosConSaldo();
  const listaOrdenada = [...listaOriginal].reverse();

  // Función auxiliar para mantener el código limpio y profesional al formatear cantidades monetarias con 2 decimales forzados
  const formatearDinero = (cantidad: number) => {
    return cantidad.toLocaleString('es-ES', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="animate-fade-in py-3 py-md-4">
      <header className="mb-4 px-2 px-md-0">
        <h2 className="fw-bold text-dark">Historial Detallado</h2>
        <p className="text-muted small">Control de ingresos, gastos y saldo tras cada operación.</p>
      </header>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-uppercase text-muted">
                <th className="px-4 py-3 text-nowrap">Concepto</th>
                <th className="py-3 text-nowrap">Fecha</th>
                <th className="text-end py-3 text-nowrap">Importe</th>
                <th className="text-end px-4 py-3 text-nowrap">Saldo Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {listaOrdenada.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 fw-semibold text-dark min-vw-25">
                    {m.concepto}
                  </td>
                  
                  <td className="text-muted small text-nowrap">
                    {m.fecha}
                  </td>

                  {/* Importe con 2 decimales forzados [cite: 2026-03-07] */}
                  <td className={`text-end fw-bold text-nowrap ${m.tipo === 'ingreso' ? 'text-success' : 'text-danger'}`}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{formatearDinero(m.cantidad)} €
                  </td>

                  {/* Saldo resultante con 2 decimales forzados [cite: 2026-03-07] */}
                  <td className="text-end px-4 fw-bold text-secondary text-nowrap">
                    {formatearDinero(m.saldoResultante)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-5 px-2 px-md-0">
        <div className="d-flex align-items-center mb-3">
          <h4 className="fw-bold text-muted mb-0">Retenciones de Tarjeta</h4>
          <span className="badge bg-warning text-dark ms-2 ms-md-3 rounded-pill">Pendientes</span>
        </div>
        
        <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
          <p className="small text-muted mb-4">
            Operaciones autorizadas pendientes de liquidación en el saldo contable .
          </p>

          <div className="list-group list-group-flush">
            <div className="list-group-item px-0 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom">
              <div className="mb-2 mb-sm-0">
                <span className="d-block fw-bold">Reserva Hotel Palace</span>
                <small className="text-muted italic">Tarjeta **** 4321</small>
              </div>
              <span className="fw-bold text-danger">-{formatearDinero(120)} €</span>
            </div>

            <div className="list-group-item px-0 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-0">
              <div className="mb-2 mb-sm-0">
                <span className="d-block fw-bold">Gasolinera Repsol</span>
                <small className="text-muted italic">Pre-autorización surtidor</small>
              </div>
              <span className="fw-bold text-danger">-{formatearDinero(30)} €</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-light rounded-3">
            <div className="d-flex justify-content-between fw-bold">
              <span>Total Retenido</span>
              <span className="text-danger">{formatearDinero(150)} €</span>
            </div>
          </div>
        </div>
      </section>

      <div className="py-4"></div>
    </div>
  );
}