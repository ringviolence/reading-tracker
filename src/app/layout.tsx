import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reading Tracker',
  description: 'Track your reading progress and earn badges',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Reading Tracker
              </Link>
              {user ? (
                <div className="flex items-center gap-6">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link href="/books" className="text-gray-600 hover:text-gray-900">
                    Books
                  </Link>
                  <Link href="/log" className="text-gray-600 hover:text-gray-900">
                    Log Reading
                  </Link>
                  <Link href="/badges" className="text-gray-600 hover:text-gray-900">
                    Badges
                  </Link>
                  <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-500 hidden sm:inline">
                      {user.name || user.email}
                    </span>
                    <LogoutButton />
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
