// app/admin/components/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (!segments.includes('admin')) return null;

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { href, label };
  });

  return (
    <nav className="text-sm text-gray-600">
      <ul className="flex space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index !== 0 && <span className="mx-1">/</span>}
            <Link href={crumb.href} className="hover:underline text-blue-600 capitalize">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
