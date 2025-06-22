import React from 'react';
import { useNavigate } from 'react-router';
import './TarjetaBook.css';

interface TarjetaBookProps {
  titulo: string;
  imagen: string;
  onIntercambiar: () => void;
  onVerMas: () => void;
}

const TarjetaBook: React.FC<TarjetaBookProps> = ({
  titulo,
  imagen,
  onVerMas,
}) => {

  const navigate = useNavigate();
  
  return (
    <div className="tarjeta-book">
      <h2 className="tarjeta-book-titulo">{titulo}</h2>
      <img className="tarjeta-book-imagen" src={imagen} alt={titulo} />
      {/* <button className="tarjeta-book-btn" onClick={onIntercambiar}>
        Intercambiar
      </button> */}

      <button className="tarjeta-book-btn" onClick={() => navigate('/intercambio')}>Intercambiar</button>
      <button className="tarjeta-book-link" onClick={onVerMas}>
        Ver mas
      </button>
    </div>
  );
};


export default TarjetaBook;