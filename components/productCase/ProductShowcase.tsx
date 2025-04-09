'use client';

import React from 'react';
import { useThemeLanguage } from '@/context/themeLanguageContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Title from '../title/Title';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  title: { RU: string; EN: string };
  price: string;
  image: string;
}

interface ProductShowcaseProps {
  title: { RU: string; EN: string };
  backgroundText: string;
  products?: Product[];
}

const testProducts: Product[] = [
  {
    id: 1,
    title: { RU: 'Хлопковая ткань', EN: 'Cotton Fabric' },
    price: '1200 ₽',
    image: '/img/products/lambre.jpg',
  },
  {
    id: 2,
    title: { RU: 'Льняная ткань', EN: 'Linen Fabric' },
    price: '1400 ₽',
    image: '/img/products/lambre02.jpg',
  },
  {
    id: 3,
    title: { RU: 'Велюр', EN: 'Velour' },
    price: '1600 ₽',
    image: '/img/products/lambre03.jpg',
  },
  {
    id: 4,
    title: { RU: 'Шёлковая ткань', EN: 'Silk Fabric' },
    price: '2000 ₽',
    image: '/img/products/allure.jpg',
  },
];

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ title, backgroundText, products }) => {
  const { language } = useThemeLanguage();

  return (
    <section className="relative w-full max-w-screen-xl mx-auto py-10">
      {/* Фоновая надпись */}
      <div className="absolute md:inset-0 top-[-150px] flex items-center pointer-events-none">
        <span className="text-[100px] md:text-[200px] font-bold text-gray-200 dark:text-gray-700 opacity-30 mt-[180px] md:mt-[-150px]">
          {backgroundText}
        </span>
      </div>

      {/* Заголовок */}
      <Title size="lg" className="mb-10">
        {title[language as 'RU' | 'EN']}
      </Title>

      {/* Слайдер товаров */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          loop
          centeredSlides={true}
          slidesPerView={1.2} // на мобильных устройствах активный слайд по центру и видны края соседних
          breakpoints={{
            640: { slidesPerView: 2, centeredSlides: false },
            1024: { slidesPerView: 3, centeredSlides: false },
          }}
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}>
          {testProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer">
                <div className="relative w-full h-[500px] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title[language as 'RU' | 'EN']}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 text-center rounded-b-xl relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {product.title[language as 'RU' | 'EN']}
                  </h3>
                  <p className="text-lg font-semibold text-primary mt-1">{product.price}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Кастомные стрелки */}
        <button
          className="swiper-button-prev hide-for-small-only hide-for-medium-only absolute top-1/2 left-4 transform -translate-y-1/2 z-10 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 text-gray-700 dark:text-gray-300"
          aria-label="Previous Slide">
          <ArrowLeft size={20} stroke="currentColor" className="text-current" />
        </button>
        <button
          className="swiper-button-next hide-for-small-only hide-for-medium-only absolute top-1/2 right-4 transform -translate-y-1/2 z-10 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 text-gray-700 dark:text-gray-300"
          aria-label="Next Slide">
          <ArrowRight size={20} stroke="currentColor" className="text-current" />
        </button>
      </div>
    </section>
  );
};

export default ProductShowcase;
