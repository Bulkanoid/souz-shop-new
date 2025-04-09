// app/admin/components/Sidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

const models = [
  { key: 'products', label: 'Продукты' },
  { key: 'categories', label: 'Категории' },
  { key: 'brands', label: 'Бренды' },
  { key: 'fabric-variants', label: 'Варианты ткани' },
  { key: 'stock-updates', label: 'Обновления остатков' },
  { key: 'stock-update-history', label: 'История остатков' },
  { key: 'orders', label: 'Заказы' },
  { key: 'carts', label: 'Корзины' },
  { key: 'favorites', label: 'Избранное' },
  { key: 'users', label: 'Пользователи' },
  { key: 'auth-providers', label: 'Провайдеры авторизации' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Админ панель</h2>
      <ul>
        {models.map((model) => (
          <li key={model.key}>
            <button
              className={clsx(
                'w-full text-left py-2 px-3 rounded mb-2 hover:bg-gray-700',
                pathname.includes(`/admin/${model.key}`) && 'bg-gray-700',
              )}
              onClick={() => router.push(`/admin/${model.key}`)}>
              {model.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
