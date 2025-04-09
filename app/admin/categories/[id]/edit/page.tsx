//app\admin\categories\[id]\edit\page.tsx

import * as api from '@/lib/adminApi/sdk';
import CategoryForm from '../../CategoryForm';
import { redirect } from 'next/navigation';
import { Category } from '@prisma/client';

export default async function CategoryEditPage({ params }: { params: { id: string } }) {
  const category = await api.getOne<Category>('category', params.id);

  const handleSubmit = async (data: Partial<Category>) => {
    await api.update<Category>('category', params.id, data);
    redirect('/admin/categories');
  };

  return (
    <div className="p-6">
      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        onCancel={() => redirect('/admin/categories')}
      />
    </div>
  );
}
