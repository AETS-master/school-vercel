-- 学習リソーステーブルの作成
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(512) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT INTO resources (title, description, url) VALUES
('JavaScript基礎', 'JavaScriptの基本的な文法とDOM操作について学習', 'https://github.com/example/javascript-basics'),
('React入門', 'Reactの基本概念とコンポーネントの作成方法', 'https://example.com/react-tutorial.pdf'),
('Node.js実践', 'サーバーサイドJavaScriptの実装方法', 'https://github.com/example/nodejs-practice');