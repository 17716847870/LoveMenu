import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const publicPaths = ['/login', '/403'];
const authApiPaths = ['/api/auth/login', '/api/auth/logout'];
const publicApiPrefixes = ['/api/auth', '/api/cron'];
const staticPaths = ['/_next', '/favicon.ico', '/logo.png'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    staticPaths.some((path) => pathname.startsWith(path)) ||
    publicApiPrefixes.some((path) => pathname.startsWith(path)) ||
    authApiPaths.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('lovemenu-token')?.value;
  let payload: any = null;

  if (token) {
    payload = await verifyToken(token);
  }

  if (!payload && !publicPaths.includes(pathname)) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (payload) {
    const { role } = payload as { role: string };

    if (pathname === '/login') {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    if (pathname === '/') {
        if (role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
