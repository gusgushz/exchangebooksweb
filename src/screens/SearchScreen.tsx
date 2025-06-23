import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TarjetaBook from '../components/TarjetaBook';
import { NavBar } from '../components/NavBar';

interface Libro {
  id: number;
  title: string;
  image_url: string;
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
        // Toma nombre y apellido si existen
        const fullName = [userObj.name, userObj.lastname].filter(Boolean).join(' ');
        setUserName(fullName || 'Usuario');
      } catch {
        setUserName('Usuario');
      }
    }
  }, []);

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

  const handleSearch = (keyword: string) => {
    // Aquí puedes hacer la búsqueda de libros
    // Por ejemplo: llamar a tu función SearchBooks y actualizar el estado
  };

  // Redirigir a SearchScreen tras 1 seg
  setTimeout(() => navigate('/search'), 1000);

  const token = localStorage.getItem('token');
  if (token) {
    localStorage.setItem('token', token);
    // setSuccessMsg('¡Login exitoso!');
    navigate('/search'); // Redirige directamente a SearchScreen
  } else {
    // setErrorMsg('Token no recibido del servidor.');
  }

  return (
    <>
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
            titulo={libro.title}
            imagen={libro.image_url}
            onIntercambiar={() => alert(`Intercambiar ${libro.title}`)}
            onVerMas={() => alert(`Ver más sobre ${libro.title}`)}
          />
        ))}
      </div>
    </>
  );
};

export default SearchScreen;