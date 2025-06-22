import React, { useState, useEffect } from 'react';
import './ProfileScreen.css';

type Book = {
  id: string;
  title: string;
  author: string;
  publicationYear: string;
  description: string;
  status: boolean;
};

type ExchangeHistory = {
  id: string;
  bookTitle: string;
  date: string;
  withUser: string;
};

export const ProfileScreen = () => {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  console.log('user', user);
  const token = localStorage.getItem('token');
  const userId = user.id;

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    career: '',
    description: '',
    imageUrl: '',
    phone: '',
  });
  const [editing, setEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [book, setBook] = useState({
    title: '',
    author: '',
    publicationYear: '',
    description: '',
    isbn: '',
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeHistory[]>([]);

  // Obtener datos del usuario
  useEffect(() => {
    async function fetchUser() {
      console.log('Obteniendo datos del usuario con ID:', userId);
      console.log('Token:', token);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      console.log('Respuesta de usuario:', res);
      if (!res.ok) {
        console.error('Error al obtener datos del usuario:', res.statusText);
        return;
      }

      const data = await res.json();
      setUserData({
        name: data.name,
        email: data.email,
        career: data.career || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        phone: data.phone || '',
      });
    }
    if (userId && token) fetchUser();
  }, []);

  // Obtener libros del usuario
  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/books/owner/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    }
    if (userId) fetchBooks();
  }, [userId]);

  // Obtener historial de intercambios
  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/exchange/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExchangeHistory(data);
      }
    }
    if (userId && token) fetchHistory();
  }, [userId, token]);

  // Editar perfil
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (res.ok) setEditing(false);
  };

  // Publicar libro
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/books/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...book,
        ownerId: userId,
      }),
    });
    if (res.ok) {
      setShowModal(false);
      setBook({ title: '', author: '', publicationYear: '', description: '', isbn: '' });
      // Refresca libros
      const booksRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/owner/${userId}`);
      if (booksRes.ok) setBooks(await booksRes.json());
    }
  };

  // Cambiar status de libro
  const handleExchangeableToggle = async (bookId: string, status: boolean) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: !status }),
    });
    if (res.ok) {
      setBooks(books => books.map(b => (b.id === bookId ? { ...b, status: !b.status } : b)));
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(prev => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));
      }
    }
  };

  // Eliminar foto de perfil
  const handleRemoveImage = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl: '' }),
    });
    if (res.ok) {
      setUserData(prev => ({
        ...prev,
        imageUrl: '',
      }));
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo-wrapper">
          <img src={userData.imageUrl || '/default-profile.png'} alt="Foto de perfil" className="profile-photo" />
          <label className="photo-overlay">
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            Cambiar foto de perfil
          </label>
          {userData.imageUrl && (
            <button type="button" className="remove-photo-btn" onClick={handleRemoveImage} style={{ marginTop: '8px' }}>
              Quitar foto de perfil
            </button>
          )}
        </div>
        <div className="profile-info">
          {editing ? (
            <form
              className="edit-form"
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}>
              <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Nombre" />
              <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Correo electrónico" />
              <input type="text" name="career" value={userData.career} onChange={handleChange} placeholder="Carrera" />
              <textarea name="description" value={userData.description} onChange={handleChange} placeholder="Descripción" />
              <input type="text" name="phone" value={userData.phone} onChange={handleChange} placeholder="Teléfono" />
              <button type="submit">Guardar</button>
            </form>
          ) : (
            <>
              <h2>{userData.name}</h2>
              <p>{userData.email}</p>
              <p>{userData.career}</p>
              <p>{userData.description}</p>
              <p>{userData.phone}</p>
              <button className="edit-btn" onClick={() => setEditing(true)}>
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
              <input type="text" name="title" value={book.title} onChange={handleBookChange} placeholder="Nombre del libro" required />
              <input type="text" name="author" value={book.author} onChange={handleBookChange} placeholder="Autor" required />
              <input type="number" name="publicationYear" value={book.publicationYear} onChange={handleBookChange} placeholder="Año" required />
              <input type="text" name="isbn" value={book.isbn} onChange={handleBookChange} placeholder="ISBN" required />
              <textarea name="description" value={book.description} onChange={handleBookChange} placeholder="Descripción" rows={3} />
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

      <div className="books-grid">
        {books.map(b => (
          <div className="book-card" key={b.id}>
            <h4>{b.title}</h4>
            <p>
              <strong>Autor:</strong> {b.author}
            </p>
            <p>
              <strong>Año:</strong> {b.publicationYear}
            </p>
            <p>{b.description}</p>
            <label className="switch">
              <input type="checkbox" checked={b.status} onChange={() => handleExchangeableToggle(b.id, b.status)} />
              <span className="slider"></span>
            </label>
            <span className="exchange-status">{b.status ? 'Disponible para intercambio' : 'No disponible'}</span>
          </div>
        ))}
      </div>

      <div className="exchange-history">
        <h3>Historial de intercambios</h3>
        <ul>
          {exchangeHistory.map(h => (
            <li key={h.id}>
              <strong>{h.bookTitle}</strong> - {h.date} con {h.withUser}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
