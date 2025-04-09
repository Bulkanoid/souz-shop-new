// app/admin/categories/CategoryForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
}

export default function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [parentId, setParentId] = useState<string | null>(null);
  const [image, setImage] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setNameRu(initialData.name_ru ?? '');
      setNameEn(initialData.name_en ?? '');
      setDescriptionRu(initialData.description_ru ?? '');
      setDescriptionEn(initialData.description_en ?? '');
      setSortOrder(initialData.sortOrder ?? 0);
      setParentId(initialData.parentId ?? null);
      setImage(initialData.image ?? []);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name_ru: nameRu,
      name_en: nameEn,
      description_ru: descriptionRu,
      description_en: descriptionEn,
      sortOrder,
      parentId,
      image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">
        {initialData ? 'Редактировать категорию' : 'Создать категорию'}
      </h3>
      <div>
        <label className="block">Название (RU)</label>
        <input
          className="w-full border px-2 py-1"
          value={nameRu}
          onChange={(e) => setNameRu(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">Название (EN)</label>
        <input
          className="w-full border px-2 py-1"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block">Описание (RU)</label>
        <textarea
          className="w-full border px-2 py-1"
          value={descriptionRu}
          onChange={(e) => setDescriptionRu(e.target.value)}
        />
      </div>
      <div>
        <label className="block">Описание (EN)</label>
        <textarea
          className="w-full border px-2 py-1"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
        />
      </div>
      <div>
        <label className="block">Сортировка</label>
        <input
          type="number"
          className="w-full border px-2 py-1"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </div>
      <div>
        <label className="block">Родительская категория (ID)</label>
        <input
          className="w-full border px-2 py-1"
          value={parentId ?? ''}
          onChange={(e) => setParentId(e.target.value || null)}
        />
      </div>
      <div>
        <label className="block">Ссылки на изображения (через запятую)</label>
        <input
          className="w-full border px-2 py-1"
          value={image.join(', ')}
          onChange={(e) => setImage(e.target.value.split(',').map((s) => s.trim()))}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Отмена
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Сохранить
        </button>
      </div>
    </form>
  );
}
