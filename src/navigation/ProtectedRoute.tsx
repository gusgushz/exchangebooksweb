// components/ProtectedRoute.tsx
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  user: any; // Se ignora, usamos directamente localStorage
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Obtener el usuario directamente del localStorage
  const hasUser = !!localStorage.getItem('user');
  
  if (!hasUser) {
    console.log("ProtectedRoute: No hay usuario en localStorage, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: Usuario encontrado en localStorage, mostrando contenido protegido");
  return <>{children}</>;
}
