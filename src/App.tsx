import { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/logo.jpg';
import portada from './assets/portada.jpg';
import Libro from './assets/libro.png';
import conexion from './assets/conexion.png';
import estrella from './assets/estrella.png';
import Principito from './assets/Principito.jpg';
import Cien from './assets/Cien.jpg';
import Quijote from './assets/Quijote.jpg';
import Rating from './components/Rating'; // Importa el modal
import TarjetaBook from './components/TarjetaBook'; // Importa la tarjeta de libro
import { useNavigate } from 'react-router';
import { SearchScreen } from './screens';
import { NavBar } from './components/navBar';
import { GetSearchBooks } from './api/GetSearchBooks';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [book, setBook] = useState<{ title: string; author: string; description: string }>(); // Estado para el libro seleccionado
  useEffect(() => {
    const fetchBook = async () => {
      const bookData = await GetSearchBooks('don');
      if (bookData) {
        setBook(bookData[0]);
      }
    };
    fetchBook();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src={logo} alt="Librova" />
          </div>
          <form className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar libros..." />
          </form>
          <NavBar />
        </div>
      </header>

      <main className="main-wrapper">
        <section className="hero">
          <div className="hero-text">
            <h1>¡BIENVENIDO A LIBROVA!</h1>
            {book && (
              <div className="book-info">
                <h2>Libro seleccionado:</h2>
                <p>Título: {book.title}</p>
                <p>Autor: {book.author}</p>
                <p>Descripción: {book.description}</p>
              </div>
            )}
            <p>"Una biblioteca colaborativa creada por y para estudiantes."</p>
            <p>Explora, conecta, ahorra a lo grande</p>
            <div className="buttons">
              <button className="btn-login">Inicio de sesión</button>
              <button className="btn-register">Registrarse</button>
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
              {/* Ejemplo de libros, puedes reemplazar por datos reales */}
              <div className="carousel-item">
                <img src={Principito} alt="Libro 1" />
                <p>El Principito</p>
              </div>
              <div className="carousel-item">
                <img src={Cien} alt="Libro 2" />
                <p>Cien años de soledad</p>
              </div>
              <div className="carousel-item">
                <img src={Quijote} alt="Libro 3" />
                <p>Don Quijote</p>
              </div>
              <div className="carousel-item">
                <img src="/libro4.jpg" alt="Libro 4" />
                <p>Harry Potter</p>
              </div>
              <div className="carousel-item">
                <img src="/libro5.jpg" alt="Libro 5" />
                <p>Matilda</p>
              </div>
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
      <div>
        <h1>Bienvenido a Exchange Books</h1>
        <p>Intercambia y descubre nuevos libros fácilmente.</p>

        <button onClick={() => setIsModalOpen(true)}>Abrir Modal</button>

        {isModalOpen && <Rating onClose={() => setIsModalOpen(false)} />}

        <TarjetaBook
          titulo="Mi gran libro de cuentos"
          imagen="https://http2.mlstatic.com/D_NQ_NP_973518-MLC50958432176_082022-O.webp"
          onIntercambiar={() => alert('Intercambiar')}
          onVerMas={() => alert('Ver más')}
        />

        <div>
          <button onClick={() => navigate('/perfilusuario')}>Ir a detalle del libro</button>
        </div>
      </div>
      <SearchScreen />

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
    track.scrollBy({ left: direction * 220, behavior: 'smooth' });
  }
}

export default App;
