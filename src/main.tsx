// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.tsx';
import { ProfileScreen, ErrorScreen, PublishBooks, LoginScreen, RegisterScreen, BookExchange, SearchScreen, UserBooksScreen } from './screens/';
import { ProtectedRoute } from './navigation/ProtectedRoute.tsx';
import { PublicRoute } from './navigation/PublicRoute.tsx';

//const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

//FIXME: crear contexto o localstarge para guardar sesión del usuario
//PARA PROBAR LA NAVEGACIÓN TANTO AQUI COMO EN LOS COMPONENTES O PAGINAS TIENEN QUE ESTAR IGUAL, ES DECIR, SI VA A SER UN USUARIO LOGGEADO, DEBE ESTAR EL OBJETO userLogged en AMBOS ACTIVO, SI NO HAY USUARIO LOGGEADO DEBE ESTAR EN NULL AMBOS
//CHECAR NAVBAR
const user = {

  id: 1,
  name: 'usuario',
  lastname: 'demo',
  email: 'user',
}; // o null si no está logueado
// // const userLogged = null;
// //FIXME: Crear funcion para obtener el usuario al que se quiere
// const otherUser = {
//   id: 2,
//   name: 'usuario',
//   lastname: 'demo2',
//   email: 'otro',
// };

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🌐 Rutas públicas */}
        <Route index path="/" element={<App />} />
        <Route path="/buscar" element={<SearchScreen />} />
        <Route path="/usuario-:userId/:name-:lastname/libros" element={<UserBooksScreen />} />

        {/* 🌐 Rutas públicas que redirigen si estas loggeado */}
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

        {/*}
        <Route
          path="/calificar"
          element={
            <ProtectedRoute user={userLogged}>
              <RatingScreen />
            </ProtectedRoute>
          }
        />*/}

        {/* ❌ Ruta para errores */}
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
