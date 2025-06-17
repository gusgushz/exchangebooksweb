import { useEffect, useState } from 'react';
import type { Doc } from './models';

export default function App() {
  const [data, setData] = useState<string | null>(null);
  const [results, setResults] = useState<Doc[] | null>(null);
  const [query, setQuery] = useState<string>('');
  const [form, setForm] = useState({
    title: '',
    isbn: '',
    author: '',
    description: '',
    publication_year: '',
    image_url: '',
    owner_id: '1', // Puedes manejar esto dinámicamente si tienes sesión
    status_for_exchange: true,
  });
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) throw new Error('Error en la petición');
      const result = await response.json();
      setData(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setData('Error al obtener los datos.');
    }
  };

  const fetchBooks = async (query: string) => {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.docs);
    } catch (error) {
      console.error("Error al obtener los libros: " + error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) fetchBooks(query);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  const newValue =
    type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;

  setForm({
    ...form,
    [name]: newValue,
  });
};

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          publication_year: Number(form.publication_year), // Aseguramos que sea número
        }),
      });

      if (!response.ok) throw new Error('Error al agregar el libro');
      setMessage('Libro agregado correctamente ✅');
      setForm({
        title: '',
        isbn: '',
        author: '',
        description: '',
        publication_year: '',
        image_url: '',
        owner_id: '1',
        status_for_exchange: true,
      });
    } catch (error) {
      console.error(error);
      setMessage('❌ Ocurrió un error al agregar el libro.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '100vh', width: '100vw', justifyContent: 'center', paddingTop: 40 }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 800 }}>
        <button onClick={fetchData}>Obtener información de usuario en BD</button>

        {data && (
          <pre style={{ background: '#f0f0f0', padding: 10, color: 'black', maxWidth: 400, overflowX: 'auto' }}>
            {data}
          </pre>
        )}

        {/* Buscar libro */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={query}
            placeholder="Buscar un libro..."
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '16px' }}
          />
          <button type="submit">Buscar</button>
        </form>

        {/* Resultados */}
        {results && results.length > 0 && (
        <div style={{ marginTop: 20, maxHeight: 300, overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.slice(0, 10).map((book, index) => (
              <li key={index} style={{ marginBottom: 20 }}>
                <strong>{book.title}</strong>
                {book.author_name && <span> – {book.author_name.join(', ')}</span>}
                <div><em>Año:</em> {book.first_publish_year || 'Desconocido'}</div>
                <Description keyId={book.key} />
              </li>
            ))}
          </ul>
        </div>
      )}

        {/* Formulario agregar libro */}
        <h2>Agregar un libro</h2>
        <form 
        onSubmit={handleAddBook} 
        style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <input type="text" name="title" placeholder="Título" value={form.title} onChange={handleFormChange} required />
          <input type="text" name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleFormChange} required />
          <input type="text" name="author" placeholder="Autor" value={form.author} onChange={handleFormChange} required />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleFormChange} required />
          <input type="number" name="publication_year" placeholder="Año de publicación" value={form.publication_year} onChange={handleFormChange} required />
          <input type="text" name="image_url" placeholder="URL de la imagen" value={form.image_url} onChange={handleFormChange} required />
          <label>
            <input type="checkbox" name="status_for_exchange" checked={form.status_for_exchange} onChange={handleFormChange} />
            Disponible para intercambio
          </label>
          <button type="submit">Agregar libro</button>
        </form>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}

function Description({ keyId }: { keyId: string }) {
  const [desc, setDesc] = useState<string>('Cargando...');

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const res = await fetch(`https://openlibrary.org${keyId}.json`);
        const data = await res.json();
        if (typeof data.description === 'string') {
          setDesc(data.description);
        } else if (typeof data.description === 'object' && data.description?.value) {
          setDesc(data.description.value);
        } else {
          setDesc('Sin descripción disponible.');
        }
      } catch {
        setDesc('Error al cargar la descripción.');
      }
    };

    fetchDescription();
  }, [keyId]);

  return <div><em>Descripción:</em> {desc}</div>;
}
