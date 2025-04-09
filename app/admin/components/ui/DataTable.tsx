// app/admin/components/ui/DataTable.tsx
'use client';

import { useMemo } from 'react';
import { useVisibleColumns } from '@/app/admin/hooks/useVisibleColumns';
import { ColumnSelector } from './ColumnSelector';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  modelKey: string;
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  sort?: string;
  direction?: 'asc' | 'desc';
  page: number;
  totalPages: number;
  onSort?: (key: string) => void;
  onPageChange?: (page: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
}

export default function DataTable({
  modelKey,
  columns,
  rows,
  sort,
  direction = 'asc',
  page,
  totalPages,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
}: DataTableProps) {
  const { visibleColumns, toggleColumn } = useVisibleColumns(
    modelKey,
    columns.map((col) => col.key),
  );

  const visible = useMemo(
    () => columns.filter((col) => visibleColumns.includes(col.key)),
    [columns, visibleColumns],
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          Показано: {rows.length} / Страница: {page} из {totalPages}
        </span>
        <ColumnSelector columns={columns} visible={visibleColumns} toggle={toggleColumn} />
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {visible.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-left cursor-pointer"
                onClick={() => col.sortable && onSort?.(col.key)}>
                {col.label}
                {col.sortable && sort === col.key && (direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
            <th className="px-3 py-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              {visible.map((col) => (
                <td key={col.key} className="px-3 py-2">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-3 py-2 space-x-2">
                {onEdit && (
                  <button onClick={() => onEdit(row)} className="text-blue-600 hover:underline">
                    Редактировать
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(row.id)} className="text-red-600 hover:underline">
                    Удалить
                  </button>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={visible.length + 1} className="text-center py-6 text-gray-500">
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-3 py-1 border rounded"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}>
          Назад
        </button>
        <button
          className="px-3 py-1 border rounded"
          disabled={page >= totalPages}
          onClick={() => onPageChange?.(page + 1)}>
          Вперёд
        </button>
      </div>
    </div>
  );
}
