import React, { useState } from 'react';
import './ProfileScreen.css';
import Perfilfoto from '../assets/PerfilFoto.jpg';

type Book = {
  title: string;
  author: string;
  year: string;
  description: string;
  exchangeable: boolean;
};

type ExchangeHistory = {
  bookTitle: string;
  date: string;
  withUser: string;
};

export const ProfileScreen = () => {
  // Estado para los datos editables del usuario
  const [user, setUser] = useState({
    name: 'Nombre de Usuario',
    email: 'usuario@email.com',
    career: 'Carrera',
    password: '********',
  });

  // Estado para la edición
  const [editing, setEditing] = useState(false);

  // Estado para el modal de libro
  const [showModal, setShowModal] = useState(false);

  // Estado para los datos del libro
  const [book, setBook] = useState({
    title: '',
    author: '',
    year: '',
    description: '',
  });

  // Estado para los libros del usuario
  const [books, setBooks] = useState<Book[]>([
    // Ejemplo de libros iniciales
    { title: 'Libro 1', author: 'Autor 1', year: '2020', description: 'Descripción 1', exchangeable: true },
    { title: 'Libro 2', author: 'Autor 2', year: '2021', description: 'Descripción 2', exchangeable: false },
    { title: 'Libro 3', author: 'Autor 3', year: '2019', description: 'Descripción 3', exchangeable: true },
    { title: 'Libro 4', author: 'Autor 4', year: '2018', description: 'Descripción 4', exchangeable: true },
    { title: 'Libro 5', author: 'Autor 5', year: '2022', description: 'Descripción 5', exchangeable: false },
    { title: 'Libro 6', author: 'Autor 6', year: '2017', description: 'Descripción 6', exchangeable: true },
    { title: 'Libro 7', author: 'Autor 7', year: '2016', description: 'Descripción 7', exchangeable: false },
    { title: 'Libro 8', author: 'Autor 8', year: '2015', description: 'Descripción 8', exchangeable: true },
    { title: 'Libro 9', author: 'Autor 9', year: '2014', description: 'Descripción 9', exchangeable: true },
  ]);

  // Estado para historial de intercambios
  const [exchangeHistory] = useState<ExchangeHistory[]>([
    { bookTitle: 'Libro 1', date: '2024-05-01', withUser: 'Juan Pérez' },
    { bookTitle: 'Libro 5', date: '2024-04-15', withUser: 'Ana Gómez' },
  ]);

  // Manejadores de cambio
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditing(true);
  const handleSave = () => setEditing(false);

  // Manejadores del modal
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooks([
      ...books,
      { ...book, exchangeable: true },
    ]);
    setShowModal(false);
    setBook({ title: '', author: '', year: '', description: '' });
  };

  // Cambiar estado de intercambio
  const handleExchangeableToggle = (index: number) => {
    setBooks(books =>
      books.map((b, i) =>
        i === index ? { ...b, exchangeable: !b.exchangeable } : b
      )
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          <img
            src={Perfilfoto}
            alt="Foto de perfil"
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          {editing ? (
            <form className="edit-form">
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Nombre"
              />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Correo"
              />
              <input
                type="text"
                name="career"
                value={user.career}
                onChange={handleChange}
                placeholder="Carrera"
              />
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Contraseña"
              />
              <button type="button" onClick={handleSave}>
                Guardar
              </button>
            </form>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.career}</p>
              <p>Contraseña: ******</p>
              <button className="edit-btn" onClick={handleEdit}>
                Editar perfil
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-actions">
        <button className="publicar-btn" onClick={() => setShowModal(true)}>
          Publicar libro
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar libro</h3>
            <form onSubmit={handleBookSubmit} className="book-form">
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleBookChange}
                placeholder="Nombre del libro"
                required
              />
              <input
                type="text"
                name="author"
                value={book.author}
                onChange={handleBookChange}
                placeholder="Autor"
                required
              />
              <input
                type="number"
                name="year"
                value={book.year}
                onChange={handleBookChange}
                placeholder="Año"
                required
              />
              <textarea
                name="description"
                value={book.description}
                onChange={handleBookChange}
                placeholder="Descripción"
                rows={3}
              />
              <div className="modal-actions">
                <button type="submit">Agregar</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid de libros */}
      <div className="books-grid">
        {books.map((b, idx) => (
          <div className="book-card" key={idx}>
            <h4>{b.title}</h4>
            <p><strong>Autor:</strong> {b.author}</p>
            <p><strong>Año:</strong> {b.year}</p>
            <p>{b.description}</p>
            <label className="switch">
              <input
                type="checkbox"
                checked={b.exchangeable}
                onChange={() => handleExchangeableToggle(idx)}
              />
              <span className="slider"></span>
            </label>
            <span className="exchange-status">
              {b.exchangeable ? 'Disponible para intercambio' : 'No disponible'}
            </span>
          </div>
        ))}
      </div>

      {/* Historial de intercambios */}
      <div className="exchange-history">
        <h3>Historial de intercambios</h3>
        <ul>
          {exchangeHistory.map((h, i) => (
            <li key={i}>
              <strong>{h.bookTitle}</strong> - {h.date} con {h.withUser}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
