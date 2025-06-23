import React, { useState, useEffect } from 'react';
import './ProfileScreen.css';
import { API_BASE_URL } from '../apiConfig';
import { NavBar } from '../components/navBar';

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
  const token = localStorage.getItem('token');
  console.log("Datos abtenidos del local storage: ", user);
  const userId = user?.id;

  const [userData, setUserData] = useState({
    name: '',
    lastname: '',
    email: '',
    description: '',
    profile_image_url: '',
    phone: '',
    rating_average: '',
  });
  const [editing, setEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [book, setBook] = useState({
    title: '',
    author: '',
    publicationYear: '',
    isbn: '',
    description: '',
  });
  const [bookImage, setBookImage] = useState<File | null>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeHistory[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Obtener datos del usuario
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error('Error al obtener datos del usuario:', res.statusText);
        return;
      }
      const data = await res.json();
      setUserData({
        name: data.name || '',
        lastname: data.lastname || '',
        email: data.email || '',
        description: data.description || '',
        profile_image_url: data.profile_image_url || '',
        phone: data.phone || '',
        rating_average: data.rating_average || '',
      });
    }
    if (userId && token) fetchUser();
  }, [userId, token]);

  // Obtener libros del usuario
  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch(`${API_BASE_URL}/api/books/owner/${userId}`);
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
      const res = await fetch(`${API_BASE_URL}/api/exchange/user/${userId}`, {
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
    // Actualiza perfil (foto, descripción, teléfono)
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        profile_image_url: userData.profile_image_url,
        description: userData.description,
        phone: userData.phone,
      }),
    });

    // Cambia contraseña si se ingresó y coincide
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordMsg('Las contraseñas no coinciden');
        return;
      }
      if (newPassword.length < 8) {
        setPasswordMsg('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      const passRes = await fetch(`${API_BASE_URL}/api/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (passRes.ok) {
        setPasswordMsg('Contraseña actualizada correctamente');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg('Error al actualizar la contraseña');
      }
    } else {
      setPasswordMsg('');
    }

    if (res.ok) setEditing(false);
  };

  // Publicar libro
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleBookImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBookImage(e.target.files[0]);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/books/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: book.title,
        isbn: book.isbn,
        author: book.author,
        publicationYear: book.publicationYear,
        ownerId: userId,
      }),
    });
    if (res.ok) {
      setShowModal(false);
      setBook({ title: '', author: '', publicationYear: '', isbn: '', description: '' });
      setBookImage(null);
      const booksRes = await fetch(`${API_BASE_URL}/api/books/owner/${userId}`);
      if (booksRes.ok) setBooks(await booksRes.json());
    } else {
      const errorText = await res.text();
      console.error('Error al agregar libro:', errorText);
    }
  };

  // Cambiar status de libro
  const handleExchangeableToggle = async (bookId: string, status: boolean) => {
    const res = await fetch(`${API_BASE_URL}/api/books/${bookId}/status`, {
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

      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
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
          profile_image_url: data.profile_image_url, // <-- asegúrate que el backend responde así
        }));
      }
    }
  };

  // Eliminar foto de perfil
  const handleRemoveImage = async () => {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ profile_image_url: '' }),
    });
    if (res.ok) {
      setUserData(prev => ({
        ...prev,
        profile_image_url: '',
      }));
    }
  };

  // Restablecer contraseña
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    const res = await fetch(`${API_BASE_URL}/api/change-password/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) {
      setPasswordMsg('Contraseña actualizada correctamente');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMsg('Error al actualizar la contraseña');
    }
  };

  if (!user) {
    return <div>No has iniciado sesión.</div>;
  }

  return (
    <>
      <NavBar showSearch={true} showProfile={true} showAbout={true} />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-photo-wrapper">
            <img src={userData.profile_image_url || '/default-profile.png'} alt="Foto de perfil" className="profile-photo" />
            <label className="photo-overlay">
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              Cambiar foto de perfil
            </label>
            {userData.profile_image_url && (
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
                <input type="text" name="name" value={userData.name} readOnly placeholder="Nombre" />
                <input type="text" name="lastname" value={userData.lastname} readOnly placeholder="Apellido" />
                <input type="email" name="email" value={userData.email} readOnly placeholder="Correo electrónico" />
                <textarea name="description" value={userData.description} onChange={handleChange} placeholder="Descripción" />
                <input type="text" name="phone" value={userData.phone} onChange={handleChange} placeholder="Teléfono" />
                {/* Campos para cambiar contraseña */}
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  autoComplete="new-password"
                />
                {passwordMsg && <p style={{ color: 'red' }}>{passwordMsg}</p>}
                <button type="submit">Guardar</button>
              </form>
            ) : (
              <>
                <h2>
                  {userData.name} {userData.lastname}
                </h2>
                <p>{userData.email}</p>
                <p>{userData.career}</p>
                <p>{userData.phone}</p>
                <p>{userData.description}</p>
                <p>Calificación promedio: {userData.rating_average}</p>
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
                {/* Input para la imagen */}
                <input type="file" name="image" accept="image/*" onChange={handleBookImageChange} />
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
              {/* Carátula del libro */}
              <img
                src={b.image_url || '/default-book.png'}
                alt={b.title}
                className="book-cover"
                style={{ width: 80, height: 120, objectFit: 'cover', marginBottom: 8 }}
              />
              <h4>{b.title}</h4>
              <p><strong>Autor:</strong> {b.author}</p>
              <p><strong>Año:</strong> {b.publicationYear}</p>
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
    </>
  );
};
