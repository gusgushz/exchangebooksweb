import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import axios from 'axios';
import logo from '../assets/logo2.png';
import './LoginScreen.css'; // reutiliza estilos existentes

export const PasswordRecoveryScreen = () => {
  const [correo, setCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!correo || !nuevaContrasena) {
      setErrorMsg('Por favor, completa ambos campos.');
      return;
    }

    try {
      console.log('Enviando a API:', {
        email: correo,
        password: nuevaContrasena
      });

      const response = await axios.put('https://exchangebooks.up.railway.app/api/change-password', {
        email: correo,
        password: nuevaContrasena
      });

      console.log('Respuesta de la API:', response.data);

      setSuccessMsg('Contraseña actualizada con éxito.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      setSuccessMsg('');

      if (error.response) {
        // Error del servidor (ej. email no registrado)
        setErrorMsg('No se pudo actualizar la contraseña. Verifica los datos ingresados.');
      } else if (error.request) {
        // Error de red
        setErrorMsg('No se pudo conectar con el servidor. Intenta más tarde.');
      } else {
        // Otro tipo de error
        setErrorMsg('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleUpdatePassword}>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="login-title">Recuperar Contraseña</h2>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="input-group password-group">
          <FaLock className="icon" />
          <input
            type={mostrarContrasena ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
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

        <button type="submit" className="login-button">Actualizar contraseña</button>
      </form>
    </div>
  );
};

export default PasswordRecoveryScreen;
