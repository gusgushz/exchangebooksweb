import React, { useState } from 'react';
import type { FormEvent } from 'react';
import './Rating.css';

interface RatingProps {
  onClose: () => void;
}

const Rating: React.FC<RatingProps> = ({ onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Calificación:', rating);
    console.log('Comentario:', comment);
    // Aquí podrías cerrar el modal o mostrar mensaje de éxito si deseas
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose} aria-label="Cerrar"> × </button>
        <div className="rating-container">
          <h2>Calificar al usuario</h2>
          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const current = index + 1;
              return (
                <span
                  key={index}
                  className={`star ${current <= (hover || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(current)}
                  onMouseEnter={() => setHover(current)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Comentario"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Rating;

