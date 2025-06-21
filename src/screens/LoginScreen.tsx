import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import type { FormEvent } from 'react';
import logo from '../assets/logo2.png';
import './LoginScreen.css';

export const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario:", username);
    console.log("Contraseña:", password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="login-title">Iniciar Sesión</h2>

        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="options">
          <label>
            <input type="checkbox" /> Recuérdame
          </label>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" className="login-button">Continuar</button>
      </form>
    </div>
  );
};

export default LoginScreen;

