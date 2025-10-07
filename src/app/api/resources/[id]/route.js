import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';

export async function PUT(request, { params }) {
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
    
    const { id } = params;
    const { title, description, url } = await request.json();
    
    if (!title || !url) {
      return NextResponse.json({ error: 'タイトルとURLは必須です' }, { status: 400 });
    }
    
    // リソースを更新
    const [updatedResource] = await sql`
      UPDATE resources 
      SET title = ${title}, description = ${description || ''}, url = ${url}
      WHERE id = ${id}
      RETURNING id, title, description, url, created_at
    `;
    
    if (!updatedResource) {
      return NextResponse.json({ error: 'リソースが見つかりません' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      resource: updatedResource,
      message: 'リソースが更新されました' 
    });
  } catch (error) {
    console.error('Update resource error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    
    const { id } = params;
    
    // リソースを削除
    const [deletedResource] = await sql`
      DELETE FROM resources 
      WHERE id = ${id}
      RETURNING id, title
    `;
    
    if (!deletedResource) {
      return NextResponse.json({ error: 'リソースが見つかりません' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `「${deletedResource.title}」が削除されました` 
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}