// app/admin/components/ui/ColumnSelector.tsx
'use client';

interface ColumnSelectorProps {
  columns: { key: string; label: string }[];
  visible: string[];
  toggle: (key: string) => void;
}

export function ColumnSelector({ columns, visible, toggle }: ColumnSelectorProps) {
  return (
    <div className="relative inline-block text-left">
      <details className="group">
        <summary className="cursor-pointer text-sm text-blue-600 underline">
          Отображаемые поля
        </summary>
        <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2">
          {columns.map((col) => (
            <label key={col.key} className="flex items-center space-x-2 text-sm py-1">
              <input
                type="checkbox"
                checked={visible.includes(col.key)}
                onChange={() => toggle(col.key)}
              />
              <span>{col.label}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
