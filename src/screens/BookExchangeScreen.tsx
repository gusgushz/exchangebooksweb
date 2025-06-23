import React, { useState } from 'react';
import { useLocation } from 'react-router';
import './BookExchangeScreen.css';

export const BookExchange: React.FC = () => {
  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : null;
  const location = useLocation();
  const libro = location.state;
  const [librosUsuario, setLibrosUsuario] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState<string>('');

  const obtenerLibrosUsuario = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`https://exchangebooks.up.railway.app/api/books/owner/${userId}`);
      const data = await response.json();
      setLibrosUsuario(data);
    } catch (error) {
      alert('No se pudieron obtener los libros del usuario.');
    }
  };

  const [lugar, setLugar] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Intercambio agendado:\nLugar: ${lugar}\nFecha: ${fecha}\nHora: ${hora}`); //ddkdkd
  };

  React.useEffect(() => {
    obtenerLibrosUsuario();
  }, []);

  return (
    <div className="user-books-bg">
      <div className="user-books-top">
        <div className="user-books-card">
          <h2>{libro.titulo}</h2>
          <img src={libro.imagen} alt={libro.titulo} style={{ width: '150px', borderRadius: '8px' }} />
          <p><strong>Autor:</strong> {libro.autor}</p>
          <p><strong>Descripción:</strong> {libro.descripcion}</p>
          <p><strong>Año de publicación:</strong> {libro.publicacionAño}</p>
        </div>
        <div>
          <select
            id="libro-select"
            className="user-books-select-btn"
            value={libroSeleccionado}
            onChange={e => setLibroSeleccionado(e.target.value)}
          >
            <option value="">Selecciona un libro</option>
            {librosUsuario.map((libro: any) => (
              <option key={libro.id} value={libro.title}>
                {libro.title}
              </option>
            ))}
          </select>
        </div>


        
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
