'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
    >
      Log out
    </button>
  );
}
