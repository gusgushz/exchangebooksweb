import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TarjetaBook from '../components/TarjetaBook';
import { NavBar } from '../components/navBar';
import './SearchScreen.css';
import axios from 'axios'; // Agregado para usar axios
import '../screens/SearchScreen.css'; // Asegúrate de tener este archivo CSS

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
  const [currentPage, setCurrentPage] = useState(1);
  const librosPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log('User from localStorage:', user);
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
  const handleSearch = (keyword: string) => {
    // Aquí puedes hacer la búsqueda de libros
    // Por ejemplo: llamar a tu función SearchBooks y actualizar el estado
  };

  // Paginación
  const indexOfLastLibro = currentPage * librosPorPagina;
  const indexOfFirstLibro = indexOfLastLibro - librosPorPagina;
  const librosActuales = libros.slice(indexOfFirstLibro, indexOfLastLibro);
  const totalPaginas = Math.ceil(libros.length / librosPorPagina);

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
      <div className="search-main-container">
        <div className="welcome-message-search">
          ¡Bienvenido, {userName}!
        </div>
        <div className="libros-grid">
          {librosActuales.map((libro) => (
            <TarjetaBook
              key={libro.id}
              titulo={libro.title}
              imagen={libro.image_url}
              onIntercambiar={() => alert(`Intercambiar ${libro.title}`)}
              onVerMas={() => alert(`Ver más sobre ${libro.title}`)}
              onVerPropietario={() => navigate(`/perfil-publico/${libro.owner.id}`)}
            >
              <button onClick={() => navigate(`/perfil-publico/${libro.owner.id}`)}>Ver perfil de propietario</button>
            </TarjetaBook>
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPaginas}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
