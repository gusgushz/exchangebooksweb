import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TarjetaBook from '../components/TarjetaBook';
import { NavBar } from '../components/NavBar';
import '../screens/SearchScreen.css'; // Asegúrate de tener este archivo CSS

interface Libro {
  id: number;
  title: string;
  image_url: string;
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

  // Paginación
  const indexOfLastLibro = currentPage * librosPorPagina;
  const indexOfFirstLibro = indexOfLastLibro - librosPorPagina;
  const librosActuales = libros.slice(indexOfFirstLibro, indexOfLastLibro);
  const totalPaginas = Math.ceil(libros.length / librosPorPagina);

  return (
    <>
      <NavBar
        showSearch={true}
        showProfile={true}
        showAbout={false}
        userName={userName}
        onSearch={handleSearch}
      />
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
    </>
  );
};

export default SearchScreen;