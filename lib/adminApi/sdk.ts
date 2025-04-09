// lib/adminApi/sdk.ts
import qs from 'query-string';

export async function getList<T>(
  model: string,
  params: {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}
): Promise<{ items: T[]; totalPages: number }> {
  const query = qs.stringify(params);
  const res = await fetch(`/api/admin/${model}?${query}`);
  if (!res.ok) throw new Error(`Ошибка при загрузке ${model}`);
  return res.json();
}

export async function getOne<T>(model: string, id: string): Promise<T> {
  const res = await fetch(`/api/admin/${model}/${id}`);
  if (!res.ok) throw new Error(`Ошибка при загрузке ${model} с id=${id}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function create<T>(model: string, data: any): Promise<T> {
  const res = await fetch(`/api/admin/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Ошибка при создании ${model}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function update<T>(model: string, id: string, data: any): Promise<T> {
  const res = await fetch(`/api/admin/${model}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Ошибка при обновлении ${model} с id=${id}`);
  return res.json();
}

export async function remove(model: string, id: string): Promise<void> {
  const res = await fetch(`/api/admin/${model}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Ошибка при удалении ${model} с id=${id}`);
}
