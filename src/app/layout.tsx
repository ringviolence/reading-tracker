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
      <body className="bg-sage min-h-screen">
        <nav className="bg-forest shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold text-white">
                📚 Shelflog
              </Link>
              {user ? (
                <div className="flex items-center gap-6">
                  <Link href="/books" className="text-white/80 hover:text-white">
                    Books
                  </Link>
                  <Link href="/badges" className="text-white/80 hover:text-white">
                    Badges
                  </Link>
                  <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                    <span className="text-sm text-white/70 hidden sm:inline">
                      {user.name || user.email}
                    </span>
                    <LogoutButton />
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    className="text-white/80 hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 border border-white/50 text-white rounded-lg hover:bg-white/10 transition-colors"
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
