// components/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  rows?: number;
  columns?: number;
  cellHeight?: string;
  cellWidth?: string;
  gap?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  rows = 1,
  columns = 1,
  cellHeight = 'h-56',
  cellWidth = 'w-full',
  gap = 'gap-4',
  className = '',
}) => {
  const totalItems = rows * columns;

  // Подбираем нужный класс для количества столбцов (для Tailwind)
  const gridColsClass =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    }[columns] || 'grid-cols-1';

  return (
    <div className={`grid ${gridColsClass} ${gap} ${className}`}>
      {Array.from({ length: totalItems }).map((_, idx) => (
        <div
          key={idx}
          className={`${cellWidth} ${cellHeight} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
        />
      ))}
    </div>
  );
};

export default Skeleton;
