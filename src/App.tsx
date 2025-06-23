import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; // Asegúrate de usar react-router-dom
import './App.css';
import logo from './assets/Logo.png';
import portada from './assets/portada.jpg';
import Libro from './assets/libro.png';
import conexion from './assets/conexion.png';
import estrella from './assets/estrella.png';
import { GetAvailableBooks, SearchBooks } from './apiFunctions';
import { NavBar } from './components/navBar';
import Perfil from './assets/Perfil.png';
 
type Book = {
  id: string;
  title: string;
  image_url: string;

};

function App() {
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const userName = user ? JSON.parse(user).name : null;

  // Redirección si ya hay sesión iniciada
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/search', { replace: true });
    }
  }, [navigate]);


  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await GetAvailableBooks();
        console.log('Libros disponibles:', res);

        const booksData: Book[] = res.map((book: Book) => ({
          id: book.id,
          title: book.title,
          image_url: book.image_url, // Usa una imagen por defecto si no hay
        }));
        setAvailableBooks(booksData); // Asegúrate que el formato coincida
      } catch (err) {
        console.error(err);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="Librova" />
          </div>
          <form
            className="search-bar"
            onSubmit={async e => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
              const keyword = input?.value.trim();
              if (!keyword) return;
              try {
                const data = await SearchBooks(keyword);
                setAvailableBooks(data);
              } catch (err) {
                console.error(err);
                alert('No se pudieron buscar libros.');
              }
            }}>
            <span className="search-icon">🔍</span>
            <input type="text" name="search" placeholder="Buscar libros..." />
          </form>
          <NavBar />
        </div>
      </header>

      <main className="main-wrapper">
        <section className="hero">
          <div className="hero-text">
            <h1>¡BIENVENIDO A LIBROVA!</h1>
            <p>"Una biblioteca colaborativa creada por y para estudiantes."</p>
            <p>Explora, conecta, ahorra a lo grande</p>
            <div className="buttons">
              <button className="btn-login" onClick={() => navigate('/login')}>
                Inicio de sesión
              </button>
              <button className="btn-register" onClick={() => navigate('/register')}>
                Registrarse
              </button>
            </div>
          </div>
          <div className="hero-img">
            <img src={portada} alt="Lectura" />
          </div>
        </section>

        <section className="cards">
          <div className="card">
            <img className="icon" src={Libro} alt="Ícono libro" />
            <h3>Intercambia Libros</h3>
            <p>Da y recibe libros fácilmente.</p>
          </div>
          <div className="card">
            <img className="icon" src={conexion} alt="conexion" />
            <h3>Conéctate con otros</h3>
            <p>Encuentra estudiantes cerca de ti.</p>
          </div>
          <div className="card">
            <img className="icon" src={estrella} alt="estrella" />
            <h3>Gana reputación</h3>
            <p>Califica y sé calificado como buen lector.</p>
          </div>
        </section>

        <section className="carousel-section">
          <h2>Libros disponibles para intercambio</h2>
          <div className="carousel">
            <button className="carousel-btn left" onClick={() => scrollCarousel(-1)}>
              &lt;
            </button>
            <div className="carousel-track" id="carousel-track">
              {availableBooks.length > 0 ? (
                availableBooks.map(book => (
                  <div className="carousel-item" key={book.id}>
                    <img src={book.image_url} alt={book.title} />
                    <p>{book.title}</p>
                  </div>
                ))
              ) : (
                <p>Cargando libros...</p>
              )}
            </div>
            <button className="carousel-btn right" onClick={() => scrollCarousel(1)}>
              &gt;
            </button>
          </div>
        </section>

        <section className="how-it-works">
          <h2>¿Cómo funciona?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-icon">📝</div>
              <div className="step-text">Regístrate gratis.</div>
            </div>
            <div className="step">
              <div className="step-icon">📚</div>
              <div className="step-text">Publica el libro que quieres intercambiar.</div>
            </div>
            <div className="step">
              <div className="step-icon">🔍</div>
              <div className="step-text">Busca libros que necesites.</div>
            </div>
            <div className="step">
              <div className="step-icon">🤝</div>
              <div className="step-text">Contacta, agenda y haz el intercambio.</div>
            </div>
            <div className="step">
              <div className="step-icon">⭐</div>
              <div className="step-text">Califica tu experiencia.</div>
            </div>
          </div>
        </section>

        <section className="about-section" id="acerca-de">
          <h2>Acerca de Librova</h2>
          <p>
            Librova es una plataforma creada por y para estudiantes, donde puedes intercambiar libros usados de manera fácil, segura y gratuita.
            Nuestra misión es fomentar la colaboración, el acceso a la lectura y el ahorro entre la comunidad estudiantil. ¡Únete, comparte tus libros
            y encuentra nuevas lecturas para tu crecimiento académico y personal!
          </p>
        </section>
      </main>

      <footer className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Redes sociales</h4>
            <div className="footer-social">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" title="Facebook">
                <span role="img" aria-label="Facebook">
                  📘
                </span>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" title="Twitter">
                <span role="img" aria-label="Twitter">
                  🐦
                </span>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" title="Instagram">
                <span role="img" aria-label="Instagram">
                  📸
                </span>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <a href="mailto:contacto@librova.com">contacto@librova.com</a>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <a href="#">Política de privacidad</a>
            <a href="#">Términos y condiciones</a>
            <a href="#">Preguntas frecuentes</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function scrollCarousel(direction: number) {
  const track = document.getElementById('carousel-track');
  if (track) {
    (track as HTMLElement).scrollBy({ left: direction * 220, behavior: 'smooth' });
  }
}

export default App;
