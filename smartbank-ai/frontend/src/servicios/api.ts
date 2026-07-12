export const URL_API =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const RUTAS_API = {
  iniciarSesion: `${URL_API}/api/auth/login/`,
  registro: `${URL_API}/api/auth/registro/`,
  cerrarSesion: `${URL_API}/api/auth/logout/`,
  usuarioActual: `${URL_API}/api/auth/me/`,

  cuentas: `${URL_API}/api/cuentas/`,
  movimientos: `${URL_API}/api/movimientos/`,
  transferencias: `${URL_API}/api/transferencias/`,

  ingreso: `${URL_API}/api/operaciones/ingreso/`,
  gasto: `${URL_API}/api/operaciones/gasto/`,
  transferencia: `${URL_API}/api/operaciones/transferencia/`,
};