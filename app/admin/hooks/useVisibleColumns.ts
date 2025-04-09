//app\admin\hooks\useVisibleColumns.ts

import { useEffect, useState } from 'react';

export function useVisibleColumns(modelKey: string, allKeys: string[]) {
    const storageKey = `admin-visible-columns-${modelKey}`;
    const [visibleColumns, setVisibleColumns] = useState<string[]>(allKeys)

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as string[];
                if (Array.isArray(parsed)) setVisibleColumns(parsed);
            } catch {}
        } 
    }, [storageKey])

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    }, [visibleColumns, storageKey])

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
  };
  return { visibleColumns, toggleColumn };
}