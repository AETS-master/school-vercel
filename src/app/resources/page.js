'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        setError('リソースの取得に失敗しました');
      }
    } catch (error) {
      setError('サーバーエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isGitHubUrl = (url) => {
    return url.includes('github.com');
  };

  const isPdfUrl = (url) => {
    return url.toLowerCase().includes('.pdf') || url.includes('pdf');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark font-space-grotesk">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-primary text-2xl mr-3">school</span>
              <h1 className="text-xl font-bold text-white">学習リソース</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              <span className="material-symbols-outlined text-sm mr-1">logout</span>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:shadow-xl transition duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {resource.title}
                  </h3>
                  <div className="flex-shrink-0 ml-2">
                    {isGitHubUrl(resource.url) ? (
                      <span className="material-symbols-outlined text-primary">code</span>
                    ) : isPdfUrl(resource.url) ? (
                      <span className="material-symbols-outlined text-red-400">picture_as_pdf</span>
                    ) : (
                      <span className="material-symbols-outlined text-gray-400">link</span>
                    )}
                  </div>
                </div>

                {resource.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(resource.created_at).toLocaleDateString('ja-JP')}
                  </span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-blue-600 text-white text-sm rounded-lg transition duration-200"
                  >
                    <span className="material-symbols-outlined text-sm mr-1">open_in_new</span>
                    開く
                  </a>
                </div>
              </div>

              {/* PDF Preview */}
              {isPdfUrl(resource.url) && (
                <div className="border-t border-gray-700 bg-gray-900 p-4">
                  <iframe
                    src={resource.url}
                    className="w-full h-40 rounded border"
                    title={resource.title}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {resources.length === 0 && !error && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">folder_open</span>
            <h3 className="text-xl font-medium text-gray-300 mb-2">リソースがありません</h3>
            <p className="text-gray-500">まだ学習リソースが追加されていません。</p>
          </div>
        )}
      </main>
    </div>
  );
}