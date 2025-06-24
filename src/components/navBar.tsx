import logo from '../assets/Logo.png';
import Perfil from '../assets/Perfil.png';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import './navBar.css';

interface NavBarProps {
  showSearch?: boolean;
  onSearch?: (keyword: string) => void;
  showProfile?: boolean;
  showAbout?: boolean;
  userName?: string;
}

export const NavBar = ({ showSearch = false, onSearch, showProfile = true, showAbout = true }: NavBarProps) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  // Actualizar el usuario cada vez que el componente se monte o cuando cambie localStorage
  useEffect(() => {
    const checkUser = () => {
      try {
        const userData = localStorage.getItem('user');
        console.log('User data from localStorage:', userData);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('User estado actualizado:', parsedUser);
        } else {
          setUser(null);
          console.log('No hay usuario en localStorage');
        }
      } catch (error) {
        console.error('Error al leer usuario del localStorage:', error);
        setUser(null);
      }
    };

    // Verificar al montar
    checkUser();

    // Verificar cuando la ventana recibe el foco
    const handleFocus = () => {
      checkUser();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      const input = (e.currentTarget as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
      onSearch(input.value.trim());
    }
  };
  const handleProfileClick = () => {
    // Verificar el usuario actual directamente del localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        console.log('Tenemos usuario: ', userData);
        // Tenemos usuario en localStorage
        setMenuOpen(open => !open);
      } else {
        console.log('No tenemos usuario: ', userData);
        // No hay usuario, redirigir al login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al leer usuario en handleProfileClick:', error);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null); // Actualizar estado
    setMenuOpen(false); // Cerrar menú
    navigate('/');
  };

  // --- HEADER PARA USUARIO LOGUEADO ---
  if (user) {
    return (
      <header className="header">
        <div className="header-content">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={logo} alt="Librova" />
          </div>
          {/* <button className="back-btn" onClick={() => navigate(-1)} style={{ marginLeft: 16 }}>
            ← Volver
          </button> */}
          {showSearch && (
            <form className="search-bar" onSubmit={handleSubmit}>
              <button type="submit" className="search-icon">
                🔍
              </button>
              <input type="text" name="search" placeholder="Buscar libros..." />
            </form>
          )}
          <nav className="nav-links">
            {showProfile && (
              <div className="profile-dropdown">
                <span className="profile-icon" onClick={handleProfileClick} style={{ cursor: 'pointer' }} title="Opciones de perfil">
                  <img src={Perfil} alt="Perfil" />
                </span>{' '}
                {menuOpen && (
                  <ul className="profile-menu">
                    <li
                      onClick={() => {
                        console.log('Navegando a la pantalla de búsqueda...');
                        navigate('/perfil');
                      }}>
                      Mi perfil
                    </li>
                    <li onClick={() => navigate('/history')}>Historial de intercambios</li>
                    <li onClick={handleLogout}>Cerrar sesión</li>
                  </ul>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }

  // --- HEADER PARA USUARIO NO LOGUEADO ---
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="nav-left">
          <div className="logo" onClick={() => navigate('/')}>
            <img src={logo} alt="Librova" />
          </div>
        </div>

        {/* Barra de búsqueda */}
        {showSearch && (
          <div className="nav-center">
            <form className="search-bar-wrapper" onSubmit={handleSubmit}>
              <input type="text" name="search" className="search-bar" placeholder="Buscar libros..." />
              <button type="submit" className="search-icon">
                🔍
              </button>
            </form>
          </div>
        )}
        <nav className="nav-links">
          <a href="/">Inicio</a>
          {showAbout && <a href="/#acerca-de">Acerca de</a>}
        </nav>
        <span className="profile-icon" onClick={handleProfileClick} style={{ cursor: 'pointer', marginLeft: 16 }} title="Iniciar sesión">
          <img src={Perfil} alt="Perfil" />
        </span>
      </div>
    </header>
  );
};
