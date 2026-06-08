import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled client-side via localStorage + AuthContext.
// Each protected page enforces its own redirect when there is no token.
// We don't gate routes here because middleware runs on the edge and can't
// read localStorage — only cookies, which we don't use.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
