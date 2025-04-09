// app/admin/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/app/admin/components/ui/SearchBar';
import DataTable from '@/app/admin/components/ui/DataTable';
import { getList, remove } from '@/lib/adminApi/sdk';
import Link from 'next/link';

interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  sort?: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [items, setItems] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    const res = await getList<Category>('category', { search, page, sort, direction });
    setItems(res.items);
    setTotalPages(res.totalPages);
  };

  useEffect(() => {
    fetchData();
  }, [search, page, sort, direction]);

  const handleDelete = async (id: string) => {
    if (confirm('Удалить категорию?')) {
      await remove('category', id);
      fetchData();
    }
  };

  const handleSort = (key: string) => {
    if (key === sort) setDirection(direction === 'asc' ? 'desc' : 'asc');
    else {
      setSort(key);
      setDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Link href="/admin/categories/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Добавить</button>
        </Link>
      </div>

      <SearchBar initial={search} onSearch={setSearch} />

      <DataTable
        modelKey="category"
        columns={[
          { key: 'name_ru', label: 'Название (RU)', sortable: true },
          { key: 'name_en', label: 'Название (EN)', sortable: true },
          { key: 'sort', label: 'Сортировка', sortable: true },
          { key: 'createdAt', label: 'Создан', sortable: true },
          { key: 'updatedAt', label: 'Обновлён', sortable: true },
        ]}
        rows={items}
        sort={sort}
        direction={direction}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSort={handleSort}
        onDelete={handleDelete}
      />
    </div>
  );
}
