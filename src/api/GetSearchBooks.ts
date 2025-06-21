export const GetSearchBooks = async (query: string) => {
  const token = localStorage.getItem('token');
  try {
    const params = new URLSearchParams({
      search: query,
    });
    console.log('Buscando libros con:', import.meta.env.VITE_BACKEND_URL);
    const url = `${import.meta.env.VITE_BACKEND_URL}api/books/available/search?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resultados:', data);
    return data;
  } catch (error) {
    console.error('Error al buscar libros:', error);
    return null;
  }
};
