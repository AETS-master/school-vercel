'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 認証状態をチェックして適切にリダイレクト
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          if (data.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/resources');
          }
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}
