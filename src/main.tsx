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
  SearchScreen,
  UserBooksScreen,
  PasswordRecoveryScreen
} from './screens/';
import { ProtectedRoute } from './navigation/ProtectedRoute.tsx';
import { PublicRoute } from './navigation/PublicRoute.tsx';

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🌐 Rutas públicas */}
        <Route index path="/" element={<App />} />
        <Route path="/buscar" element={<SearchScreen />} />
        <Route path="/usuario-:userId/:name-:lastname/libros" element={<UserBooksScreen />} />

        {/* 🌐 Rutas públicas que redirigen si estás logueado */}
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <LoginScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <RegisterScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/recuperar"
          element={ // 👈 NUEVA RUTA
            <PublicRoute user={user}>
              <PasswordRecoveryScreen />
            </PublicRoute>
          }
        />

        {/* ✅ Rutas protegidas */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute user={user}>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/publicar"
          element={
            <ProtectedRoute user={user}>
              <PublishBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intercambio"
          element={
            <ProtectedRoute user={user}>
              <BookExchange />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil-usuario"
          element={
            <ProtectedRoute user={user}>
              <UserBooksScreen />
            </ProtectedRoute>
          }
        />

        {/* ❌ Ruta para errores */}
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
