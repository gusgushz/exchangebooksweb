// components/PublicRoute.tsx
import { Navigate } from 'react-router';

interface PublicRouteProps {
  user: any; // tu tipo de usuario si lo tienes tipado
  children: React.ReactNode;
}

export function PublicRoute({ user, children }: PublicRouteProps) {
  if (user) {
    return <Navigate to="/inicio" replace />;
  }
  return <>{children}</>;
}
