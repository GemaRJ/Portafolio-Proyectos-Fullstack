"use client";
import { useState } from "react";
import Swal from "sweetalert2";

interface Props {
  onLogin: (nombreUsuario: string) => void;
}

const USUARIOS = [
  { dni: "12345678X", clave: "1234", nombre: "Admin" },
  { dni: "87654321Y", clave: "4321", nombre: "Invitado" }
];

export default function Login({ onLogin }: Props) {
  const [dniInput, setDniInput] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dniNormalizado = dniInput.trim().toUpperCase();
    const encontrado = USUARIOS.find(
      (u) => u.dni === dniNormalizado && u.clave === pass
    );

    if (encontrado) {
      onLogin(encontrado.nombre);
    } else {
      Swal.fire({
        title: 'Error de acceso',
        text: 'DNI o clave incorrectos. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonColor: '#0052cc',
        confirmButtonText: 'Entendido'
      });
    }
  }; 

  return (
    /* px-3 añade separación en los bordes del móvil para que el card no toque las paredes */
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 px-3 bg-light">
      
      {/* Sistema de columnas responsivo */}
      <div className="col-12 col-md-5 col-lg-4">
        <div className="card p-4 p-md-5 shadow-lg border-0 rounded-4 bg-white">
          <header className="text-center mb-4">
            <h2 className="fw-bold text-primary mb-1">BANCA ONLINE</h2>
            <p className="text-muted mb-0">Accede a tu cuenta de forma segura, introduce tu DNI y clave.</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">DNI / NIE</label>
              <input 
                type="text" 
                className="form-control form-control-lg fs-6" 
                placeholder="12345678X"
                onChange={(e) => setDniInput(e.target.value)} 
                required 
              />
              <div className="form-text mt-2" style={{ fontSize: '0.75rem' }}>
                La letra puede ser minúscula o mayúscula.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Clave secreta</label>
              <input 
                type="password" 
                className="form-control form-control-lg fs-6" 
                placeholder="••••"
                onChange={(e) => setPass(e.target.value)} 
                required 
              />
              <div className="form-text mt-2" style={{ fontSize: '0.75rem' }}>
                Introduce tus 4 dígitos de seguridad.
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-3">
              Acceder al Sistema
            </button>
          </form>
        </div>
        
        {/* Pie de página del login para mejorar la UX en móviles */}
        <div className="text-center mt-4">
          <p className="small text-muted">¿Has olvidado tus claves? <span className="text-primary cursor-pointer">Contacta con nosotros</span></p>
        </div>
      </div>
    </div>
  );
}