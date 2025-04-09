// components/SkeletonWrapper.tsx
import React from 'react';
import Skeleton from './Skeleton';

interface SkeletonWrapperProps {
  /** Состояние загрузки, которое передаётся извне */
  isLoading: boolean;
  /**
   * Параметры для скелетона, которые будут переданы в компонент Skeleton.
   * Например: rows, columns, cellHeight, cellWidth, gap и т.д.
   */
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
  /** Дочерние элементы, которые будут отображаться, когда загрузка завершена */
  children: React.ReactNode;
}

const SkeletonWrapper: React.FC<SkeletonWrapperProps> = ({
  isLoading,
  skeletonProps,
  children,
}) => {
  if (isLoading) {
    return <Skeleton {...skeletonProps} />;
  }

  return <>{children}</>;
};

export default SkeletonWrapper;
