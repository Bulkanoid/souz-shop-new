// app/admin/categories/create/page.tsx

'use client';

import { create } from '@/lib/adminApi/sdk';
import { Category } from '@prisma/client';
import { redirect } from 'next/navigation';
import CategoryForm from '../CategoryForm';

export default function CategoryCreatePage() {
  const handleSubmit = async (data: Partial<Category>) => {
    await create<Category>('category', data);
    redirect('/admin/categories');
  };

  return (
    <div className="p-6">
      <CategoryForm onSubmit={handleSubmit} onCancel={() => redirect('/admin/categories')} />
    </div>
  );
}
