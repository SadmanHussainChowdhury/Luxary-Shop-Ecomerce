'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          <Link
            href={`/${locale}/admin`}
            className={`px-4 py-3 text-sm font-medium transition ${
              isActive('/admin') && !isActive('/admin/registrations')
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href={`/${locale}/admin/registrations`}
            className={`px-4 py-3 text-sm font-medium transition ${
              isActive('/admin/registrations')
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Registrations
          </Link>
          <Link
            href={`/${locale}/admin/pages`}
            className={`px-4 py-3 text-sm font-medium transition ${
              isActive('/admin/pages')
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Pages
          </Link>
        </div>
      </div>
    </nav>
  );
}

