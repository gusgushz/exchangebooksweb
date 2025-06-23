import logo from '../assets/Logo.png';
import Perfil from '../assets/Perfil.png';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import './navBar.css';

interface NavBarProps {
  showSearch?: boolean;
  onSearch?: (keyword: string) => void;
  showProfile?: boolean;
  showAbout?: boolean;
  userName?: string;
}

export const NavBar = ({
  showSearch = false,
  onSearch,
  showProfile = true,
  showAbout = true
}: NavBarProps) => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      const input = (e.currentTarget as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
      onSearch(input.value.trim());
    }
  };

  const handleProfileClick = () => {
    if (user) {
      setMenuOpen(open => !open);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

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
              <input
                type="text"
                name="search"
                className="search-bar"
                placeholder="Buscar libros..."
              />
              <span className="search-icon">🔍</span>
            </form>
          </div>
        )}

        {/* Perfil y enlaces */}
        <div className="nav-right">
          <nav className="nav-links">
            <a href="/">Inicio</a>
            {showAbout && <a href="/#acerca-de">Acerca de</a>}
            {showProfile && (
              <div className="profile-dropdown">
                <span className="profile-icon" onClick={handleProfileClick}>
                  <img src={Perfil} alt="Perfil" />
                </span>
                {menuOpen && (
                  <ul className="profile-menu">
                    <li onClick={() => navigate('/perfil')}>Configuración de perfil</li>
                    <li onClick={() => navigate('/user-books')}>Mis libros</li>
                    <li onClick={() => navigate('/publish')}>Subir un libro</li>
                    <li onClick={() => navigate('/history')}>Historial de intercambios</li>
                    <li onClick={handleLogout}>Cerrar sesión</li>
                  </ul>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
