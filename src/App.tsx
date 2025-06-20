import './App.css';
import React, { useState } from "react";
import Rating from './components/Rating'; // Importa el modal
import TarjetaBook from "./components/TarjetaBook"; // Importa la tarjeta de libro
import { useNavigate } from 'react-router-dom';
import { SearchScreen } from './screens';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
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
        <button onClick={() => navigate('/Perfilusuario')}>
          Ir a detalle del libro
        </button>
    </div>

    </div>
    <SearchScreen />
  );
}

export default App;
