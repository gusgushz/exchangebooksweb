import { NavLink, redirect, replace, useNavigate } from 'react-router';
import Perfil from '../assets/Perfil.png';
import '../App.css';
import './navBar.css';
import { useState, useRef, useEffect } from 'react';

export const NavBar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  //PARA PROBAR LA NAVEGACIÓN TANTO AQUI COMO EN LOS COMPONENTES O PAGINAS TIENEN QUE ESTAR IGUAL, ES DECIR, SI VA A SER UN USUARIO LOGGEADO, DEBE ESTAR EL OBJETO userLogged en AMBOS ACTIVO, SI NO HAY USUARIO LOGGEADO DEBE ESTAR EN NULL AMBOS
  //CHECAR MAIN.TS
  // const userLogged = {
  //   id: 1,
  //   name: 'usuario',
  //   lastname: 'demo',
  //   email: 'user',
  // }; // o null si no está logueado
  // const userLogged = null;

  const handleProfileClick = () => {
    if (user !== null) {
      setIsModalOpen(prev => !prev);
    } else {
      navigate('/login');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsModalOpen(false);
    replace('/');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="relative">
      <nav className="nav-links">
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <a href="#acerca-de">Acerca de</a>

        <button onClick={handleProfileClick} className="profile-icon" ref={buttonRef}>
          <img src={Perfil} alt="Perfil" />
        </button>
      </nav>

      {isModalOpen && (
        <div className="user-modal" ref={modalRef}>
          <button
            onClick={() => {
              setIsModalOpen(false);
              navigate('/perfil');
            }}>
            Ir al perfil
          </button>
          <button onClick={handleLogout} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
