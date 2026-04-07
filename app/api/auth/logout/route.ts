import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  const cookieOptions = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  };

  response.cookies.set('player_id', '', cookieOptions);
  response.cookies.set('player_name', '', cookieOptions);

  return response;
}
