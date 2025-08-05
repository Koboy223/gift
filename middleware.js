export function middleware(request) {
  const auth = request.headers.get('authorization');

  const username = 'admin';
  const password = 'say';

  if (!auth) {
    return new Response('Autenticación requerida', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Acceso restringido"' },
    });
  }

  const b64auth = auth.split(' ')[1];
  const [user, pass] = atob(b64auth).split(':');

  if (user === username && pass === password) {
    // Permitir continuar a la ruta solicitada
    return;
  }

  return new Response('Credenciales inválidas', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Acceso restringido"' },
  });
}
