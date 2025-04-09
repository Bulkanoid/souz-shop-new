// app/admin/components/ui/SearchBar.tsx
'use client';

import { useEffect, useState } from 'react';

interface SearchBarProps {
  initial?: string;
  onSearch: (value: string) => void;
  delay?: number;
}

export default function SearchBar({ initial = '', onSearch, delay = 400 }: SearchBarProps) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(value.trim());
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay, onSearch]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Поиск..."
      className="border px-3 py-2 rounded w-full max-w-xs"
    />
  );
}
