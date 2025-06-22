import React from 'react';
import TarjetaBook from '../components/TarjetaBook'; // Ajusta la ruta si es necesario

export const SearchScreen = () => {
  return (
    <div>
      <TarjetaBook
        titulo="Mi gran libro de cuentos"
        imagen="https://http2.mlstatic.com/D_NQ_NP_973518-MLC50958432176_082022-O.webp"
        onIntercambiar={() => alert('Intercambiar')}
        onVerMas={() => alert('Ver más')}
      />
    </div>
  );
};

export default SearchScreen;