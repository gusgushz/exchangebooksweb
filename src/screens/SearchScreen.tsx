import React, { useEffect, useState } from 'react';
import TarjetaBook from '../components/TarjetaBook';
import './SearchScreen.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router';

interface Libro {
  owner_profile_image: string;
  owner_name: string;
  owner_lastname: string;
  title: string;
  image_url: string;
}

export const SearchScreen = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch('https://exchangebooks.up.railway.app/api/books/available');
        const data = await response.json();
        setLibros(data);
      } catch (error) {
        console.error('Error al obtener los libros:', error);
      }
    };

    fetchLibros();
  }, []);

  // Filtrado simple por título
  const librosFiltrados = libros.filter(libro =>
    libro.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="search-bg">
      <div className="search-bar-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>
      <div className="tarjetas-grid">
        {librosFiltrados.map((libro) => (
          <TarjetaBook
            propietario={
              <button
                className="propietario-link"
                onClick={() => navigate('/perfil-usuario')}
                type="button"
              >
                {`${libro.owner_profile_image} ${libro.owner_name} ${libro.owner_lastname}`}
              </button>
            }
            propietarioImagen={libro.owner_profile_image}
            titulo={libro.title}
            imagen={libro.image_url}
            onIntercambiar={() => alert(`Intercambiar ${libro.title}`)}
            onVerMas={() => alert(`Ver más sobre ${libro.title}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchScreen;