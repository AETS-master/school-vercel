'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, isAdmin: true }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('サーバーエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center font-space-grotesk">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">管理者ダッシュボード</h1>
            <p className="text-gray-400">管理者用ログイン</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                管理者パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="管理者パスワードを入力"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : '管理者ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-gray-400 hover:text-primary text-sm transition duration-200"
            >
              生徒用ログインはこちら
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}