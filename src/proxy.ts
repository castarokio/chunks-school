import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

function isPublicRoute(pathname: string, method: string): boolean {
  if (pathname === '/api/auth' && method === 'POST') return true;
  if (pathname === '/api/auth/register' && method === 'POST') return true;
  if (pathname === '/api/auth/logout') return true;
  if (pathname === '/api') return true;
  if (pathname === '/api/contact' && method === 'POST') return true;
  if (pathname === '/api/courses' && method === 'GET') return true;

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { method } = request;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname, method)) {
    return NextResponse.next();
  }

  let token = request.cookies.get('token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const decoded = await verifyJWT(token);
  if (!decoded) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired session token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decoded.userId);
  requestHeaders.set('x-user-role', decoded.role);
  requestHeaders.set('x-user-email', decoded.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
