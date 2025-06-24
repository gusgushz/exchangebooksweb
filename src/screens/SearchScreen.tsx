import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TarjetaBook from '../components/TarjetaBook';
import { NavBar } from '../components/navBar';
import './SearchScreen.css';
import axios from 'axios'; // Agregado para usar axios
// import '../screens/SearchScreen.css'; // Asegúrate de tener este archivo CSS

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
interface User {
  id: string;
  name: string;
  lastname: string;
  image_url: string;
}

export const SearchScreen = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const librosPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log('User from localStorage:', user);
    if (user) {
      try {
        const userObj: User = JSON.parse(user);
        // const fullName = [userObj.name, userObj.lastname].filter(Boolean).join(' ');
        setUser(userObj);
      } catch {
        // setUser('Usuario');
      }
    }
  }, []);

  const fetchLibros = async () => {
    try {
      if (!user) return;
      const response = await axios.get('https://exchangebooks.up.railway.app/api/books/available');
      console.log('Libros obtenidos:', response.data);

      const librosData = response.data
        .filter((libro: any) => libro.owner_id !== user.id)
        .map((libro: any) => ({
          id: libro.id,
          title: libro.title,
          image_url: libro.image_url,
          author: libro.author,
          description: libro.description,
          publication_year: libro.publication_year,
          owner_id: libro.owner_id,
          owner_name: libro.owner_name,
          owner_lastname: libro.owner_lastname,
          owner_profile_image: libro.owner_profile_image,
        }));
      setLibros(librosData);
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
      const res = await fetch(`https://exchangebooks.up.railway.app/api/books/available/search?search=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      console.log('Libros encontrados:', data);
      const librosEncontrados = data.map((libro: any) => ({
        id: libro.book.id,
        title: libro.book.title,
        image_url: libro.book.image_url,
        author: libro.book.author,
        description: libro.book.description,
        publication_year: libro.book.publication_year,
        owner_id: libro.owner.id,
        owner_name: libro.owner.name,
        owner_lastname: libro.owner.lastname,
        owner_profile_image: libro.owner.image_url,
      }));
      setLibros(librosEncontrados || []);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };
  // const handleSearch = (keyword: string) => {
  //   // Aquí puedes hacer la búsqueda de libros
  //   // Por ejemplo: llamar a tu función SearchBooks y actualizar el estado
  // };

  // Paginación
  const indexOfLastLibro = currentPage * librosPorPagina;
  const indexOfFirstLibro = indexOfLastLibro - librosPorPagina;
  const librosActuales = libros.slice(indexOfFirstLibro, indexOfLastLibro);
  const totalPaginas = Math.ceil(libros.length / librosPorPagina);

  return (
    <div className="search-bg">
      <NavBar showSearch={true} showProfile={true} showAbout={false} userName={user?.name} onSearch={handleSearch} />

      <div className="welcome-message-search">¡Bienvenido, {user?.name}!</div>

      <div className="libros-grid">
        {libros.map(libro => (
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
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPaginas}
        </span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPaginas}>
          Siguiente
        </button>
      </div>
      {/* <div className="search-main-container">
        <div className="welcome-message-search">¡Bienvenido, {userName}!</div>
        <div className="libros-grid">
          {librosActuales.map(libro => (
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
      </div> */}
    </div>
  );
};

export default SearchScreen;
