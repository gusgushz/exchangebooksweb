import { API_BASE_URL } from "./apiConfig";

// Obtener libros disponibles
export async function GetAvailableBooks() {
  const res = await fetch(`${API_BASE_URL}/api/books/available`);
  if (!res.ok) throw new Error("No se pudieron obtener los libros");
  return res.json();
}

// Buscar libros por palabra clave
export async function SearchBooks(keyword: string) {
  const res = await fetch(`${API_BASE_URL}/api/books/available/search?search=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("No se pudieron buscar libros");
  return res.json();
}

// Puedes agregar aquí más funciones para otras rutas de la API