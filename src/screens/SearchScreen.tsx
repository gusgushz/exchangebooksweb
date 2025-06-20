import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchScreen.css';

interface Book {
  id: string;
  title: string;
  thumbnail: string;
}

export const SearchScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://www.googleapis.com/books/v1/volumes?q=cuentos+infantiles')
      .then(res => res.json())
      .then(data => {
        const bookItems = data.items.slice(0, 6).map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || 'Libro sin título',
          thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'
        }));
        setBooks(bookItems);
      });
  }, []);

  return (
    <div className="search-screen-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="book-grid">
        {books
          .filter(book => book.title.toLowerCase().includes(search.toLowerCase()))
          .map(book => (
            <div key={book.id} className="book-card">
              <h3>{book.title}</h3>
              <img src={book.thumbnail} alt={book.title} />
              <button>Ver más</button>
              <button>Intercambiar</button>
            </div>
          ))}
      </div>
    </div>
  );
};
