"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function PaginaCambio() {
  const [tasas, setTasas] = useState<any>(null);
  const [monedaDestino, setMonedaDestino] = useState("USD");
  const [cantidad, setCantidad] = useState(1);

  // Lógica para la fecha dinámica 
  const fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() - 1); // Resto 1 día para obtener el "cierre de ayer" 
  const fechaCierre = fechaActual.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/EUR")
      .then(res => res.json())
      .then(data => {
        setTasas(data.rates);
        Swal.fire({
          title: 'Cambio Actualizado',
          text: `Valores reales al cierre del ${fechaCierre}`, 
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      })
      .catch(err => {
        console.error("Error API:", err);
        Swal.fire('Error', 'No se pudo conectar con el mercado de divisas.', 'error');
      });
  }, [fechaCierre]);

  const divisasConfig = [
    { code: "USD", name: "Dólar Estadounidense", symbol: "$" },
    { code: "GBP", name: "Libra Esterlina", symbol: "£" }
  ];

  return (
    <div className="animate-fade-in row justify-content-center mt-3 mt-md-5 px-3">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-lg border-0 rounded-4 bg-white overflow-hidden">
          
          <div className="p-4 text-center text-white" style={{ background: '#002e73' }}>
            <h2 className="fw-bold m-0 fs-3">Conversor de Divisas</h2>
            
          </div>

          <div className="card-body p-4">
            <div className="mb-4">
              <label className="form-label fw-bold small text-muted">INTRODUCE EUROS (€)</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-2">€</span>
                <input 
                  type="number" 
                  className="form-control border-2 fw-bold" 
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  min="0"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-muted">CAMBIAR A:</label>
              <select 
                className="form-select form-select-lg border-2"
                value={monedaDestino}
                onChange={(e) => setMonedaDestino(e.target.value)}
              >
                {divisasConfig.map(d => (
                  <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div className="text-center p-4 rounded-4" style={{ background: '#f0f4f8', border: '2px dashed #0052cc' }}>
              <span className="text-muted small d-block mb-1 fw-bold">VALOR TRAS CIERRE DE BOLSA</span>
              <h1 className="display-5 fw-bold text-dark m-0">
                {tasas ? (cantidad * tasas[monedaDestino]).toLocaleString('es-ES', { minimumFractionDigits: 2 }) : "..."} 
                <span className="ms-2 text-primary">
                  {divisasConfig.find(d => d.code === monedaDestino)?.symbol}
                </span>
              </h1>
            </div>

            <footer className="mt-4 text-center">
              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
               Datos actualizados a cierre contable de bolsa: <strong>{fechaCierre}</strong>.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}