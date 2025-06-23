import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import type { FormEvent } from 'react';
import logo from '../assets/Logo.png';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginScreen.css';

export const LoginScreen = () => {
  const [username, setUsername] = useState(""); // correo
  const [password, setPassword] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  //const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !password) {
      setErrorMsg('Por favor, completa ambos campos.');
      return;
    }

    try {
      const response = await axios.post('https://exchangebooks.up.railway.app/api/login', {
        email: username,
        password: password
      });

      console.log('Respuesta login:', response.data);
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        setSuccessMsg('¡Login exitoso!');
        setTimeout(() => navigate('/'), 1000); // Redirigir al home tras 1 seg
      } else {
        setErrorMsg('Token no recibido del servidor.');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Error al iniciar sesión. Revisa tus credenciales.');
      }
      setSuccessMsg('');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="login-title">Iniciar Sesión</h2>

        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group password-group">
          <FaLock className="icon" />
          <input
            type={mostrarContrasena ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password-icon"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
          >
            {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <button type="submit" className="login-button">Continuar</button>

        <div className="login-options">
          <span className="left-option" onClick={() => navigate('/register')}>
            Registrarse
          </span>
          <span className="right-option" onClick={() => navigate('/recuperar')}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
