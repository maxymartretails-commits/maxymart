import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 1) Setup intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First run i18n middleware (locale handling)
  const response = intlMiddleware(request);
  if (response) return response;

  // 2) Auth check for /admin
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// 3) Match both i18n and admin routes
export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // i18n
    '/admin/:path*', // admin auth
  ],
};
