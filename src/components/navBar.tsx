import logo from '../assets/Logo.png';
import Perfil from '../assets/Perfil.png';
import { useNavigate } from 'react-router';
import { useState } from 'react';

interface NavBarProps {
  showSearch?: boolean;
  onSearch?: (keyword: string) => void;
  showProfile?: boolean;
  showAbout?: boolean;
}

export const NavBar = ({
  showSearch = false,
  onSearch,
  showProfile = false,
  showAbout = true,
}: NavBarProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      const input = (e.currentTarget as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
      onSearch(input.value.trim());
    }
  };

  const handleProfileClick = () => {
    setMenuOpen((open) => !open);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logo} alt="Librova" />
        </div>
        {showSearch && (
          <form className="search-bar" onSubmit={handleSubmit}>
            <span className="search-icon">🔍</span>
            <input type="text" name="search" placeholder="Buscar libros..." />
          </form>
        )}
        <nav className="nav-links">
          <a href="/">Inicio</a>
          {showAbout && <a href="/#acerca-de">Acerca de</a>}
          {showProfile && (
            <div className="profile-dropdown">
              <span
                className="profile-icon"
                onClick={handleProfileClick}
                style={{ cursor: 'pointer' }}
                title="Opciones de perfil"
              >
                <img src={Perfil} alt="Perfil" />
              </span>
              {menuOpen && (
                <ul className="profile-menu">
                  <li onClick={() => navigate('/profile')}>Configuración de perfil</li>
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
    </header>
  );
};
