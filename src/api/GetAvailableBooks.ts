export const GetAvailableBooks = async () => {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/books/available`;
    const response = await fetch(url, {
      method: 'GET',
    });

    if (response.status !== 200) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error al buscar libros:', error);
    return null;
  }
};
