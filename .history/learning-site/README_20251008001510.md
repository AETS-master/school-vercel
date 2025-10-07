# Learning Resource Site

Next.jsで構築された学習リソース管理サイトです。生徒用の閲覧機能と管理者用のリソース管理機能を提供します。

## 📋 機能概要

### 生徒用機能
- 共通パスワードによる認証（Cookie保存）
- 学習リソース一覧の閲覧
- PDFの埋め込み表示
- GitHubリポジトリリンクへのアクセス

### 管理者機能
- 管理者専用パスワードによる認証
- リソースのCRUD操作（作成・読み取り・更新・削除）
- リソース管理ダッシュボード

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.5.4 (App Router)
- **言語**: JavaScript
- **データベース**: Neon (PostgreSQL)
- **スタイリング**: Tailwind CSS
- **認証**: Cookie-based authentication
- **デプロイ**: Vercel

## 📊 データベーススキーマ

### resources テーブル
```sql
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(512) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 セットアップ手順

### 1. 依存関係のインストール
```bash
cd learning-site
npm install
```

### 2. 環境変数の設定
`.env.local`ファイルを作成し、以下の設定を追加：

```env
# Neon Database
DATABASE_URL="postgresql://username:password@hostname/database"

# 認証用パスワード
STUDENT_PASSWORD="your_student_password"
ADMIN_PASSWORD="your_admin_password"

# Next.js
NEXTAUTH_SECRET="your_secret_key"
```

### 3. データベースのセットアップ
Neonコンソールで以下のSQLを実行してテーブルを作成：

```sql
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(512) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 📁 プロジェクト構造

```
learning-site/
├── src/
│   ├── app/
│   │   ├── api/          # API Routes
│   │   │   ├── auth/     # 認証関連API
│   │   │   └── resources/ # リソース関連API
│   │   ├── admin/        # 管理者ページ
│   │   ├── login/        # ログインページ
│   │   ├── resources/    # リソース一覧ページ
│   │   └── middleware.js # 認証ミドルウェア
│   ├── components/       # 再利用可能コンポーネント
│   └── lib/             # ユーティリティ関数
├── public/              # 静的ファイル
└── design_blueprint/    # デザインテンプレート
```

## 🔐 認証システム

### 生徒用認証
- 共通パスワードでログイン
- Cookieに認証状態を保存
- リソース一覧のみアクセス可能

### 管理者認証
- 管理者専用パスワードでログイン
- 管理者ダッシュボードにアクセス
- リソースの追加・編集・削除が可能

## 🌐 API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/check` - 認証状態確認

### リソース管理
- `GET /api/resources` - リソース一覧取得
- `POST /api/resources` - リソース作成（管理者のみ）
- `PUT /api/resources/[id]` - リソース更新（管理者のみ）
- `DELETE /api/resources/[id]` - リソース削除（管理者のみ）

## 🎨 デザイン

サイバーパンク風のダークテーマを採用：
- 背景色: `#101c22`
- プライマリカラー: `#0b95da`
- フォント: Space Grotesk, Material Symbols

## 📦 デプロイ

### Vercelでのデプロイ
1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. 自動デプロイが開始されます

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

プルリクエストや Issue の投稿を歓迎します。

---

Created with ❤️ using Next.js and Neon
