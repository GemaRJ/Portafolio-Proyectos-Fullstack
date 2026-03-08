"use client";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Cargando() {
  useEffect(() => {
   
    Swal.fire({
      title: "Conectando...",
      text: "Verificando credenciales y cargando tu posición global",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        
        Swal.showLoading();
      },
      timer: 3000, // Simulamos un tiempo de carga de 2 segundos
      color: "#002e73",
      backdrop: `rgba(0,46,115,0.1)`
    });

   
    return () => {
      Swal.close();
    };
  }, []);


  return (
    <div className="loader-container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center opacity-50">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="small fw-bold text-primary text-uppercase">Sincronizando datos...</p>
      </div>
    </div>
  );
}