import React from 'react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import './TarjetaBook.css';

interface TarjetaBookProps {
  id?: string;
  titulo?: string;
  imagen?: string;
  autor?: string;
  descripcion?: string;
  publicacionAño?: string;
  idPropietario?: string;
  propietario?: React.ReactNode;
  propietarioImagen?: string;
  onIntercambiar?: () => void;
  onVerMas?: () => void;
}

const TarjetaBook: React.FC<TarjetaBookProps> = ({
  id,
  titulo,
  imagen,
  autor,
  descripcion,
  publicacionAño,
  idPropietario,
  propietario,
  propietarioImagen,
  onVerMas,
}) => {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  console.log({ autor, descripcion, publicacionAño });

  return (
    <div className="tarjeta-book">
      <div
        className="propietario-info"
        onClick={() =>
          navigate('/perfil-usuario', {
            state: {
              propietarioNombre: propietario,
              propietarioId: idPropietario,
            },
          })
        }
        title="Ver perfil del propietario"
      >
        <img className="propietario-img" src={propietarioImagen} alt={titulo} />
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
              autor,
              descripcion,
              publicacionAño,
            },
          })
        }
      >
        Intercambiar
      </button>
      <button className="tarjeta-book-link" onClick={() => setModalAbierto(true)}>
        Ver mas
      </button>

      {modalAbierto && (
        <div className="modal-bg" onClick={() => setModalAbierto(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{titulo}</h2>
            <img className="tarjeta-book-imagen" src={imagen} alt={titulo} />
            <p><strong>Autor:</strong> {autor}</p>
            <p><strong>Descripción:</strong> {descripcion}</p>
            <p><strong>Año de publicación:</strong> {publicacionAño}</p>
            <button onClick={() => setModalAbierto(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarjetaBook;
