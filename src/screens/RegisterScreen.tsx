import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import logo from '../assets/Logo.png';
import './RegisterScreen.css';
import { useNavigate } from 'react-router';

export const RegisterScreen = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const validateName = (value: string) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log('Intentando registrar:', { nombre, apellido, correo, contrasena });

    // Validaciones
    if (!validateName(nombre) || !validateName(apellido)) {
      setErrorMsg('Nombre y apellido deben contener solo letras y al menos 2 caracteres.');
      setSuccessMsg('');
      return;
    }

    if (!validateEmail(correo)) {
      setErrorMsg('Correo electrónico no válido.');
      setSuccessMsg('');
      return;
    }

    if (!validatePassword(contrasena)) {
      setErrorMsg('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
      setSuccessMsg('');
      return;
    }

    try {
      const response = await axios.post('https://exchangebooks.up.railway.app/api/register', {
        name: nombre,
        lastname: apellido,
        email: correo,
        password: contrasena,
      });
      console.log('Respuesta de registro:', response.data);

      setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
      setErrorMsg('');
      setNombre('');
      setApellido('');
      setCorreo('');
      setContrasena('');
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Error al registrar:', error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Error al registrar. Intenta de nuevo.');
      }
      setSuccessMsg('');
    }
  };

  return (
    <div className="register-screen-body">
      <div className="signup-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>
          Crear
          <br />
          Cuenta
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Correo electrónico" value={correo} onChange={e => setCorreo(e.target.value)} required />
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
            <span className="toggle-password-icon" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}

          <button type="submit" className="signup-button">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};
