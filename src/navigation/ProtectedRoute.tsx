// components/ProtectedRoute.tsx
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  user: any; // o tu tipo de usuario
  children: React.ReactNode;
}

export function ProtectedRoute({ user, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
