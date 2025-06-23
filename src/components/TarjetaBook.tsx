import React from 'react';
import { useNavigate } from 'react-router';
import './TarjetaBook.css';

interface TarjetaBookProps {
  propietario: React.ReactNode;
  propietarioImagen: string;
  titulo: string;
  imagen: string;
  id: string;
  author: string;
  description: string;
  publication_year: string;
  onIntercambiar: () => void;
  onVerMas: () => void;
}

const TarjetaBook: React.FC<TarjetaBookProps> = ({
  propietario,
  propietarioImagen,
  titulo,
  imagen,
  id,
  author,
  description,
  publication_year,
  onVerMas,
}) => {
  const navigate = useNavigate();

  return (
    <div className="tarjeta-book">
      <div
        className="propietario-info"
        onClick={() => navigate('/perfil-usuario')}
        title="Ver perfil del propietario"
      >
        <img
          className="propietario-img"
          src={propietarioImagen}
          alt="Propietario"
        />
        <span className="propietario-nombre">{propietario}</span>
      </div>

      <h3 className="tarjeta-book-titulo">{titulo}</h3>
      <img className="tarjeta-book-imagen" src={imagen} alt={titulo} />

      <button
        className="tarjeta-book-btn"
        onClick={() =>
          navigate('/intercambio', {
            state: {
              libroId: id,
              titulo,
              imagen,
              author,
              description,
              publication_year,
            },
          })
        }
      >
        Intercambiar
      </button>

      <button className="tarjeta-book-link" onClick={onVerMas}>
        Ver más
      </button>
    </div>
  );
};

export default TarjetaBook;
