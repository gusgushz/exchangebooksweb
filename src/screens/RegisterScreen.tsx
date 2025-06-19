import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../assets/logo2.png';
import './RegisterScreen.css';

export const RegisterScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Nombre: ${nombre}\nApellido: ${apellido}\nCorreo: ${correo}\nContraseña: ${contrasena}`);
  };

  return (
    <div className="register-screen-body">
      <div className="signup-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Crear<br />Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-button">Registrarse</button>
        </form>
      </div>
    </div>
  );
};
