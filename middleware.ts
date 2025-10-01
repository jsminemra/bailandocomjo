import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId');
  const { pathname } = request.nextUrl;

  // Páginas públicas que não precisam de autenticação
  const publicPaths = ['/', '/signup', '/api/simple-login', '/api/signup'];
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith('/api/'));

  // Se está tentando acessar uma página protegida sem estar logado
  if (!isPublicPath && !userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está logado e tentando acessar login ou signup, redireciona para dashboard
// Se está logado e tentando acessar a home (login) ou signup, redireciona para dashboard
if ((pathname === '/' || pathname === '/signup') && userId) {
  return NextResponse.redirect(new URL('/home', request.url));
}

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};