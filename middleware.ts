import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const publicPaths = ['/login', '/403'];
const authApiPaths = ['/api/auth/login', '/api/auth/logout'];
const staticPaths = ['/_next', '/favicon.ico', '/logo.png', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 放行静态资源和认证API
  if (
    staticPaths.some((path) => pathname.startsWith(path)) ||
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

  // 如果已登录，处理角色访问权限
  if (payload) {
    const { role } = payload as { role: string };

    // 已登录状态下访问 /login，根据角色重定向
    if (pathname === '/login') {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // 普通用户访问 /admin 页面，跳转到 /403
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    // 根目录重定向
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
