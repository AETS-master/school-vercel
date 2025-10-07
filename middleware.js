import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // 公開ページ（認証不要）
  const publicPaths = ['/', '/login', '/admin/login'];
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // 静的ファイルは認証チェックをスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Cookieから認証トークンを取得
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    // 管理者ページへのアクセスの場合は管理者ログインページにリダイレクト
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // 生徒ページへのアクセスの場合は生徒ログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // トークンの検証
  const decoded = verifyToken(token);
  if (!decoded) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 管理者ページへのアクセス時は管理者権限を確認
  if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};