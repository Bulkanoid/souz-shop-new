'use client';

import React from 'react';
import { useThemeLanguage } from '@/context/themeLanguageContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Title from '../title/Title';
import { useCategories } from '@/hooks/useCategories';
import SkeletonWrapper from '../skeleton/SkeletonWrapper';

export default function Catalog() {
  const { language } = useThemeLanguage();
  const { categories, isLoading } = useCategories();

  return (
    <section className="relative w-full max-w-screen-xl mx-auto py-10 dark:bg-gray-900">
      {/* Фоновая надпись */}
      <div className="absolute md:inset-0 top-[-150px] flex items-center pointer-events-none">
        <span className="text-[100px] md:text-[200px] font-bold text-gray-200 dark:text-gray-700 opacity-30 mt-[180px] md:mt-[-150px]">
          Каталог
        </span>
      </div>

      <Title size="lg" className="mb-10">
        {language === 'RU' ? 'Каталог товаров' : 'Product Catalog'}
      </Title>

      <SkeletonWrapper
        isLoading={isLoading && !categories.length}
        skeletonProps={{ rows: 1, columns: 4 }}>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden">
              <div className="relative w-full h-56 overflow-hidden">
                {/* Картинка товара */}
                <Image
                  src="/img/catalog/fabrics.webp"
                  alt={language === 'RU' ? category.name_ru : category.name_en}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-t-lg transition-transform duration-300 group-hover:scale-110"
                />

                {/* Полупрозрачный фон при наведении */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Название категории */}
                <div className="absolute bottom-3 left-3 z-20 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded shadow">
                  {language === 'RU' ? category.name_ru : category.name_en}
                </div>

                {/* Кнопка "Перейти" / "Go" */}
                <a
                  href={`/catalog/${category.id}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 text-white font-bold text-lg">
                  {language === 'RU' ? 'Перейти' : 'Go'}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </SkeletonWrapper>
    </section>
  );
}
