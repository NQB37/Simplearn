import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Use refreshToken since it's an HTTP-Only cookie sent to our frontend server automatically
  const token = request.cookies.get('refreshToken')?.value;
  const decodedToken = token ? parseJwt(token) : null;
  const userRole = decodedToken?.role?.toUpperCase();
  const { pathname } = request.nextUrl;

  // Protected: /student and /courses (All authenticated users)
  if (pathname.startsWith('/student') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin bypass for all protected routes
  if (token && userRole === 'ADMIN') {
    return NextResponse.next();
  }

  // Protected: /instructor (Instructor only, Admin bypassed above)
  if (pathname.startsWith('/instructor')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (userRole !== 'INSTRUCTOR') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  // Protected: /admin (Admin only)
  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/instructor/:path*', '/admin/:path*'],
};
