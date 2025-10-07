import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET(request) {
  try {
    // 認証チェック
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
    }
    
    // リソース一覧を取得
    const resources = await sql`
      SELECT id, title, description, url, created_at 
      FROM resources 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 管理者認証チェック
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
    }
    
    const { title, description, url } = await request.json();
    
    if (!title || !url) {
      return NextResponse.json({ error: 'タイトルとURLは必須です' }, { status: 400 });
    }
    
    // 新しいリソースを追加
    const [newResource] = await sql`
      INSERT INTO resources (title, description, url)
      VALUES (${title}, ${description || ''}, ${url})
      RETURNING id, title, description, url, created_at
    `;
    
    return NextResponse.json({ 
      success: true, 
      resource: newResource,
      message: 'リソースが追加されました' 
    });
  } catch (error) {
    console.error('Create resource error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}