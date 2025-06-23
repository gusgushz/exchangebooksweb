import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import TarjetaBook from '../components/TarjetaBook';
import './UserBooksScreen.css';

interface LibroPorpietario {
  id: string;
  title: string;
  image_url: string;
  owner_id: string;
  owner_name?: string;
  owner_lastname?: string;
  owner_profile_image?: string;
  author?: string;
  description?: string;
  publication_year?: string;
}

export const UserBooksScreen = () => {
  const location = useLocation();
  const propietarioNombre = location.state?.propietarioNombre || 'Propietario';
  const propietarioId = location.state?.propietarioId;
  const propietarioImagen = location.state?.propietarioImagen || ''; // Asegúrate de pasar esta prop desde TarjetaBook

  const [libros, setLibros] = useState<LibroPorpietario[]>([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (!propietarioId) return;
    fetch(`https://exchangebooks.up.railway.app/api/books/owner/${propietarioId}`)
      .then(res => res.json())
      .then(data => setLibros(data))
      .catch(() => setLibros([]));
  }, [propietarioId]);

  // Filtrado de libros por búsqueda
  const librosFiltrados = libros.filter(libro =>
    libro.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="userbooks-bg">
      <div className="userbooks-header">
        <img className="userbooks-avatar" src={propietarioImagen} alt={propietarioNombre} />
        <h1 className="userbooks-nombre">{propietarioNombre}</h1>
      </div>
      <div className="userbooks-searchbar">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <span className="userbooks-search-icon">🔍</span>
      </div>
      <div className="libros-grid">
        {librosFiltrados.length === 0 && <p>No hay libros para mostrar.....</p>}
        {librosFiltrados.map(libro => (
          <TarjetaBook
            id={libro.id}
            titulo={libro.title}
            imagen={libro.image_url}
            autor={libro.author || ''}
            descripcion={libro.description || ''}
            publicacionAño={libro.publication_year?.toString() || ''}
            idPropietario={libro.owner_id}
            propietario={`${libro.owner_name} ${libro.owner_lastname}`}
            propietarioImagen={libro.owner_profile_image || ''}
            onIntercambiar={() => alert(`Intercambiar ${libro.title}`)}
            onVerMas={() => alert(`Ver más sobre ${libro.title}`)}
          />
        ))}
      </div>
    </div>
  );
};