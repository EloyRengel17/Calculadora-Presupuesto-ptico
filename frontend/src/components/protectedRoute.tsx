import { Navigate, Outlet } from "react-router-dom";

/**
 * Componente de Ruta Protegida
 * Verifica si existe la sesión en el localStorage antes de permitir el acceso.
 */
const ProtectedRoute = () => {
  // Buscamos la bandera de sesión que guardaste en el login
  const auth = localStorage.getItem("auth");

  // Si NO existe 'auth', redirigimos al Login ('/login') inmediatamente.
  // Usamos 'replace' para que el usuario no pueda volver atrás con las flechas del navegador.
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, 'Outlet' renderiza el componente hijo (en este caso, el Dashboard).
  return <Outlet />;
};

export default ProtectedRoute;