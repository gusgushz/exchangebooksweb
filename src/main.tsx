// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.tsx';
import {
  ProfileScreen,
  ErrorScreen,
  PublishBooks,
  LoginScreen,
  RegisterScreen,
  BookExchange,
  RatingScreen,
  SearchScreen,
  UserBooksScreen,
} from './screens/';
import { ProtectedRoute } from './navigation/ProtectedRoute.tsx';
import { PublicRoute } from './navigation/PublicRoute.tsx';

//FIXME: crear contexto o localstarge para guardar sesión del usuario
const userLogged = {
  id: 1,
  name: 'usuario',
  lastname: 'demo',
  email: 'user',
}; // o null si no está logueado

//FIXME: Crear funcion para obtener el usuario al que se quiere
const otherUser = {
  id: 2,
  name: 'usuario',
  lastname: 'demo2',
  email: 'otro',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🌐 Rutas públicas */}
        <Route path="/inicio" element={<App />} />
        <Route path="/buscar" element={<SearchScreen />} />
        <Route path={`/:${otherUser.name}+${otherUser.lastname}+${otherUser.id}/libros`} element={<UserBooksScreen />} />

        {/* 🌐 Rutas públicas que redirigen si estas loggeado */}
        <Route
          path="/login"
          element={
            <PublicRoute user={userLogged}>
              <LoginScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute user={userLogged}>
              <RegisterScreen />
            </PublicRoute>
          }
        />

        {/* ✅ Rutas protegidas */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute user={userLogged}>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publicar"
          element={
            <ProtectedRoute user={userLogged}>
              <PublishBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intercambio"
          element={
            <ProtectedRoute user={userLogged}>
              <BookExchange />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calificar"
          element={
            <ProtectedRoute user={userLogged}>
              <RatingScreen />
            </ProtectedRoute>
          }
        />

        {/* ❌ Ruta para errores */}
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
