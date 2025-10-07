import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'ログアウトしました' 
    });
    
    // Cookieを削除
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}