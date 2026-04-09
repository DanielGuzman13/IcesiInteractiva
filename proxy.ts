import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const playerId = request.cookies.get('player_id')?.value;

  if (!playerId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/:path*'],
};