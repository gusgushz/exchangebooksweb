export const PostLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const { token, userLogged } = await response.json();

    // ✅ Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userLogged));

    console.log('Sesión iniciada con:', JSON.stringify(userLogged));
    return userLogged;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return null;
  }
};
