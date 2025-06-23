
import React, { useState } from 'react';
import './BookExchangeScreen.css';

export const BookExchange: React.FC = () => {
  const [lugar, setLugar] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Intercambio agendado:\nLugar: ${lugar}\nFecha: ${fecha}\nHora: ${hora}`); //ddkdkd
  };

  return (
    <div className="user-books-bg">
      <div className="user-books-top">
        <div className="user-books-card">
          
        </div>
        <button className="user-books-select-btn">
          Seleccionar
        </button>
      </div>

      <form className="user-books-form" onSubmit={handleSubmit}>
        <h3>Agendar intercambio</h3>
        <input
          type="text"
          placeholder="Lugar"
          value={lugar}
          onChange={e => setLugar(e.target.value)}
          required
        />
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          required
        />
        <input
          type="time"
          value={hora}
          onChange={e => setHora(e.target.value)}
          required
        />
        <button type="submit">
          Agendar intercambio
        </button>
      </form>
    </div>
  );
};
