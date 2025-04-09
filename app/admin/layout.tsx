// app/admin/layout.tsx
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen mt-16">
      <Sidebar />
      <main className="flex-1 p-6">
        <Breadcrumbs />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
