"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Importamos la librería para una mejor UX 
import { obtenerDatosSaldo, registrarTransferencia } from "../../service/servicioBanco";

export default function PaginaTransferencia() {
  const router = useRouter();
  const { disponible } = obtenerDatosSaldo(); // Obtenemos el saldo actual 
  
  const [destinatario, setDestinatario] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("Transferencia");

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    const importe = Number(monto);

    // 1. Validaciones preventivas de negocio
    if (importe <= 0) {
      Swal.fire('Importe inválido', 'Introduce una cantidad mayor a 0€.', 'warning');
      return;
    }
    if (importe > disponible) {
      Swal.fire('Saldo insuficiente', 'No tienes fondos suficientes para esta operación.', 'error');
      return;
    }

    // 2. Resumen de validación con SweetAlert2 
    Swal.fire({
      title: 'Resumen de la Operación',
      html: `
        <div class="text-start p-3 bg-light rounded-3 border">
          <p class="mb-2"><strong>Destinatario:</strong> <span class="text-primary">${destinatario.toUpperCase()}</span></p>
          <p class="mb-2"><strong>Importe total:</strong> <span class="text-danger">-${importe.toLocaleString()} €</span></p>
          <p class="mb-0"><strong>Categoría:</strong> <span class="badge bg-secondary">${categoria}</span></p>
        </div>
        <p class="mt-3 small text-muted">¿Confirmas que todos los datos son correctos?</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#0052cc',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, enviar ahora',
      cancelButtonText: 'Corregir datos'
    }).then((result) => {
      // 3. Ejecución final tras confirmación del usuario 
      if (result.isConfirmed) {
        registrarTransferencia(destinatario, importe, categoria);
        
        Swal.fire({
          title: '¡Envío completado!',
          text: 'La transferencia se ha registrado en tu historial.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Redirigimos para ver el balance actualizado 
        router.push("/movimientos");
      }
    });
  };

  return (
    <div className="animate-fade-in py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
            <h2 className="fw-bold mb-4 text-primary">Nueva Transferencia</h2>
            
            <div className="p-3 bg-light rounded-3 mb-4 border-start border-4 border-primary">
              <span className="text-muted small d-block">Saldo disponible para enviar</span>
              <h4 className="fw-bold m-0">{disponible.toLocaleString()} €</h4>
            </div>

            <form onSubmit={manejarEnvio}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Beneficiario (Nombre o IBAN)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={destinatario}
                  onChange={(e) => setDestinatario(e.target.value)}
                  placeholder="Nombre o IBAN del destinatario"
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Categoría del Gasto</label>
                <select 
                  className="form-select" 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Vivienda">Vivienda</option>
                  <option value="Ocio">Ocio</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Transferencia">Transferencia a terceros</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Importe a enviar (€)</label>
                <input 
                  type="number" 
                  className="form-control form-control-lg fw-bold text-primary" 
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm">
                Confirmar y Enviar Fondos
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}