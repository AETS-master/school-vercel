import { NextResponse } from 'next/server';
import { checkStudentPassword, checkAdminPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password, isAdmin } = await request.json();
    
    if (!password) {
      return NextResponse.json({ error: 'パスワードが必要です' }, { status: 400 });
    }
    
    let isValidPassword = false;
    let role = 'student';
    
    if (isAdmin) {
      isValidPassword = checkAdminPassword(password);
      role = 'admin';
    } else {
      isValidPassword = checkStudentPassword(password);
      role = 'student';
    }
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 });
    }
    
    // JWTトークンを生成
    const token = generateToken({ role, iat: Date.now() });
    
    // レスポンスを作成してCookieを設定
    const response = NextResponse.json({ 
      success: true, 
      role,
      message: 'ログインに成功しました' 
    });
    
    // HTTPOnly Cookieとしてトークンを設定
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24時間
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}