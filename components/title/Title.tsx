'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeLanguage } from '@/context/themeLanguageContext';

interface TitleProps {
  children: React.ReactNode;
  /** Размер заголовка: sm, md, lg, xl */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Выравнивание заголовка: left, center, right */
  align?: 'left' | 'center' | 'right';
  /** Дополнительные CSS классы */
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  children,
  size = 'xl',
  align = 'center',
  className = '',
}) => {
  // Для соответствия стилю заголовка в слайдере
  // по умолчанию на мобильных устройствах text-3xl, а на десктопе text-6xl
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'text-base md:text-lg';
      break;
    case 'md':
      sizeClasses = 'text-xl md:text-2xl';
      break;
    case 'lg':
      sizeClasses = 'text-2xl md:text-4xl';
      break;
    case 'xl':
    default:
      sizeClasses = 'text-3xl md:text-6xl';
      break;
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  // Для стилизации в зависимости от темы (светлая — текст серый, тёмная — светлый)
  // Здесь можно использовать Tailwind-классы, которые автоматически переключаются в dark mode
  const colorClasses = 'text-gray-800 dark:text-gray-200';

  return (
    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${sizeClasses} font-bold ${alignClasses} ${colorClasses} ${className}`}>
      {children}
    </motion.h2>
  );
};

export default Title;
