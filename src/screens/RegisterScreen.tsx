import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router';
<<<<<<< HEAD
import logo from '../assets/logo2.png';
=======
import logo from '../assets/Logo.png';
>>>>>>> 6afac48fe3662063107c3b0cb92db44ca4de6274
import './RegisterScreen.css';

export const RegisterScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const validateName = (value: string) =>
    /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');

    if (!validateName(nombre) || !validateName(apellido)) {
      setErrorMsg('Nombre y apellido deben contener solo letras y al menos 2 caracteres.');
      return;
    }

    if (!validateEmail(correo)) {
      setErrorMsg('Correo electrónico no válido.');
      return;
    }

    if (!validatePassword(contrasena)) {
      setErrorMsg('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }

    try {
      const response = await axios.post('https://exchangebooks.up.railway.app/api/register', {
      name: nombre,
      lastname: apellido,
      email: correo,
      password: contrasena
      });

      console.log('Respuesta de registro:', response.data);

      setSuccessMsg('¡Registro exitoso! Redirigiendo a login...');
      setErrorMsg('');
      setNombre('');
      setApellido('');
      setCorreo('');
      setContrasena('');

      setTimeout(() => {
      navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Error al registrar:', error);

      if (error.response) {
        // Error del servidor (por ejemplo: correo ya registrado, validaciones fallidas, etc.)
        setErrorMsg('No se pudo completar el registro. Intenta más tarde.');
      } else if (error.request) {
        // Error de red
        setErrorMsg('No se pudo conectar con el servidor. Intenta más tarde.');
      } else {
        // Otro tipo de error
        setErrorMsg('Ocurrió un error inesperado.');
      }

      setSuccessMsg('');
    }
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

          <div className="input-group password-group">
            <FaLock className="input-icon" />
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
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

          <button type="submit" className="signup-button">Registrarse</button>
        </form>
      </div>
    </div>
  );
};
