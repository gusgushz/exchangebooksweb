import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TarjetaBook from '../components/TarjetaBook';
import { NavBar } from '../components/navBar';
import './SearchScreen.css';
import axios from 'axios'; // Agregado para usar axios

interface Libro {
  id: string;
  title: string;
  image_url: string;
  author: string;
  description: string;
  publication_year: string;
  owner_id: string;
  owner_name: string;
  owner_lastname: string;
  owner_profile_image: string;
}

export const SearchScreen = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [userName, setUserName] = useState<string>('Usuario');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        const fullName = [userObj.name, userObj.lastname].filter(Boolean).join(' ');
        setUserName(fullName || 'Usuario');
      } catch {
        setUserName('Usuario');
      }
    }
  }, []);

  const fetchLibros = async () => {
    try {
      const response = await axios.get('https://exchangebooks.up.railway.app/api/books/available');
      setLibros(response.data);
    } catch (error) {
      console.error('Error al obtener los libros:', error);
    }
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  const handleSearch = async (keyword: string) => {
    try {
      if (!keyword.trim()) {
        fetchLibros(); // Mostrar todos si no hay búsqueda
        return;
      }

      const response = await axios.get(`https://exchangebooks.up.railway.app/api/books/available/search`, {
        params: { keyword }
      });
      setLibros(response.data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  return (
    <div className="search-bg">
      <NavBar
        showSearch={true}
        showProfile={true}
        showAbout={false}
        userName={userName}
        onSearch={handleSearch}
      />

      <div className="welcome-message-search">
        ¡Bienvenido, {userName}!
      </div>

      <div className="libros-grid">
        {libros.map((libro) => (
          <TarjetaBook
            key={libro.id}
            id={libro.id}
            titulo={libro.title}
            imagen={libro.image_url}
            autor={libro.author || ''}
            descripcion={libro.description || ''}
            publicacionAño={libro.publication_year?.toString() || ''}
            idPropietario={libro.owner_id}
            propietario={`${libro.owner_name} ${libro.owner_lastname}`}
            propietarioImagen={libro.owner_profile_image}
            onIntercambiar={() => alert(`Intercambiar ${libro.title}`)}
            onVerMas={() => alert(`Ver más sobre ${libro.title}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchScreen;
