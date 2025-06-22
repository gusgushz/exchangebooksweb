import React, { useEffect, useState } from 'react';
import TarjetaBook from '../components/TarjetaBook'; // Ajusta la ruta si es necesario

interface Libro{
  id: number;
  title: string;
  image_url: string;
}

export const SearchScreen = () => {

  const [libros, setLibros] = useState<Libro[]>([]);
  
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

  return (
    <div>
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
  );
};

export default SearchScreen;