import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo2.png';
import './PasswordRecoveryScreen.css';

export const PasswordRecoveryScreen = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Por favor, ingresa un correo válido.');
      return;
    }

    try {
      setLoading(true);
      // Ajusta la URL a la de tu API
      const response = await axios.post('https://exchangebooks.up.railway.app/api/password-recovery', { email });
      setSuccessMsg('Correo enviado. Revisa tu bandeja para restablecer tu contraseña.');
      setEmail('');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Error al enviar el correo. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-container">
      <form className="recovery-form" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="recovery-title">Recuperar Contraseña</h2>

        <div className="input-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <button type="submit" className="recovery-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar correo'}
        </button>
      </form>
    </div>
  );
};
