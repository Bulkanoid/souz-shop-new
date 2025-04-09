// app/admin/products/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVisibleColumns } from '../hooks/useVisibleColumns';

interface Product {
  id: string;
  name_ru: string;
  name_en: string;
  description_ru?: string;
  description_en?: string;
  price: number;
  stock: number;
  excelName?: string;
  category?: { name_ru: string };
  brand?: { name_ru: string };
  manufacturer?: string;
  weight?: number;
  density?: number;
  survivability?: number;
  createdAt: string;
  updatedAt: string;
}

const allColumns = [
  { key: 'name_ru', label: 'Название (RU)' },
  { key: 'name_en', label: 'Название (EN)' },
  { key: 'price', label: 'Цена' },
  { key: 'stock', label: 'Остаток' },
  { key: 'category', label: 'Категория' },
  { key: 'brand', label: 'Бренд' },
  { key: 'manufacturer', label: 'Производитель' },
  { key: 'weight', label: 'Вес' },
  { key: 'density', label: 'Плотность' },
  { key: 'survivability', label: 'Износостойкость' },
  { key: 'createdAt', label: 'Создан' },
  { key: 'updatedAt', label: 'Обновлён' },
];

export default function ProductListPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const { visibleColumns, toggleColumn } = useVisibleColumns(
    'product',
    allColumns.map((col) => col.key),
  );
  const ITEMS_PER_PAGE = 10;

  const search = params.get('search') || '';
  const sortField = params.get('sort') || 'createdAt';
  const sortDirection = params.get('direction') === 'asc' ? 'asc' : 'desc';
  const page = parseInt(params.get('page') || '1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/admin/product?search=${search}&sort=${sortField}&direction=${sortDirection}&page=${page}&limit=${ITEMS_PER_PAGE}`,
        );
        const data = await res.json();
        setProducts(data.items);
      } catch (err) {
        console.error('Ошибка при загрузке продуктов', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, sortField, sortDirection, page]);

  const updateParam = (key: string, value: string | number) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set(key, value.toString());
    if (key !== 'page') newParams.set('page', '1');
    router.push(`/admin/products?${newParams.toString()}`);
  };

  // const toggleColumn = (key: string) => {
  //   setVisibleColumns((prev) =>
  //     prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
  //   );
  // };

  const handleSort = (field: string) => {
    const currentSort = params.get('sort') || 'createdAt';
    const currentDir = params.get('direction') || 'desc';

    if (currentSort === field) {
      updateParam('direction', currentDir === 'asc' ? 'desc' : 'asc');
    } else {
      const newParams = new URLSearchParams(params.toString());
      newParams.set('sort', field);
      newParams.set('direction', 'asc');
      newParams.set('page', '1');
      router.push(`/admin/products?${newParams.toString()}`);
    }
  };

  const getSortArrow = (field: string) => {
    const activeField = params.get('sort') || 'createdAt';
    const direction = params.get('direction') || 'desc';
    if (activeField !== field) return '';
    return direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Продукты</h1>
        <Link href="/admin/products/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Добавить</button>
        </Link>
      </div>

      <div className="mb-4 flex gap-4 items-start">
        <input
          type="text"
          placeholder="Поиск по названию..."
          className="border p-2 w-full"
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
        />

        {/* <div className="border p-2 rounded bg-gray-50 text-sm">
          <span className="block font-semibold mb-1">Отображаемые поля:</span>
          {allColumns.map((col) => (
            <label key={col.key} className="block">
              <input
                type="checkbox"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggleColumn(col.key)}
              />{' '}
              {col.label}
            </label>
          ))}
        </div> */}

        <div className="relative">
          <button
            onClick={() => setShowColumnSelector((prev) => !prev)}
            className="border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm">
            Отображаемые поля
          </button>
          {showColumnSelector && (
            <div className="absolute top-full mt-2 right-0 bg-white border p-3 rounded shadow-md z-10 max-h-96 overflow-y-auto">
              {allColumns.map((col) => (
                <label key={col.key} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                  />{' '}
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                {allColumns.map(
                  (col) =>
                    visibleColumns.includes(col.key) && (
                      <th
                        key={col.key}
                        className="p-2 text-left cursor-pointer"
                        onClick={() => handleSort(col.key)}>
                        {col.label} {getSortArrow(col.key)}
                      </th>
                    ),
                )}
                <th className="p-2 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products.map((p) => (
                  <tr key={p.id} className="border-t">
                    {visibleColumns.includes('name_ru') && <td className="p-2">{p.name_ru}</td>}
                    {visibleColumns.includes('name_en') && <td className="p-2">{p.name_en}</td>}
                    {visibleColumns.includes('price') && <td className="p-2">{p.price} ₽</td>}
                    {visibleColumns.includes('stock') && <td className="p-2">{p.stock}</td>}
                    {visibleColumns.includes('category') && (
                      <td className="p-2">{p.category?.name_ru || '-'}</td>
                    )}
                    {visibleColumns.includes('brand') && (
                      <td className="p-2">{p.brand?.name_ru || '-'}</td>
                    )}
                    {visibleColumns.includes('manufacturer') && (
                      <td className="p-2">{p.manufacturer || '-'}</td>
                    )}
                    {visibleColumns.includes('weight') && (
                      <td className="p-2">{p.weight || '-'}</td>
                    )}
                    {visibleColumns.includes('density') && (
                      <td className="p-2">{p.density || '-'}</td>
                    )}
                    {visibleColumns.includes('survivability') && (
                      <td className="p-2">{p.survivability || '-'}</td>
                    )}
                    {visibleColumns.includes('createdAt') && (
                      <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                    )}
                    {visibleColumns.includes('updatedAt') && (
                      <td className="p-2">{new Date(p.updatedAt).toLocaleDateString()}</td>
                    )}
                    <td className="p-2">
                      <Link href={`/admin/products/${p.id}/edit`}>
                        <button className="text-blue-600 hover:underline">Редактировать</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              {products && products.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="text-center p-4 text-gray-500">
                    Нет данных
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center text-sm">
            <span>Страница {page}</span>
            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => updateParam('page', page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50">
                Назад
              </button>
              <button
                onClick={() => updateParam('page', page + 1)}
                className="px-3 py-1 border rounded">
                Далее
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
