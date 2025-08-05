export function middleware(req) {
  const auth = req.headers.get('authorization');

  const username = 'admin';
  const password = 'sai';

  if (!auth) {
    return new Response('Autenticación requerida', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Acceso restringido"' },
    });
  }

  const b64auth = auth.split(' ')[1];
  const [user, pass] = atob(b64auth).split(':');

  if (user === username && pass === password) {
    return; // Usuario autorizado, continuar
  }

  return new Response('Credenciales inválidas', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Acceso restringido"' },
  });
}
