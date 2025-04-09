'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeLanguage } from '@/context/themeLanguageContext';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

// Массив слайдов с переводами
const slides = [
  {
    id: 2,
    title: { RU: 'Forward', EN: 'Forward' },
    subtitle: { RU: 'КОЛЛЕКЦИЯ', EN: 'COLLECTION' },
    description: {
      RU: 'открывает возможности для интерьерных импровизаций',
      EN: 'unleashing possibilities for interior improvisations',
    },
    image: '/img/slider/Forward.jpg',
  },
  {
    id: 3,
    title: { RU: 'Like', EN: 'Like' },
    subtitle: { RU: 'Современный выбор', EN: 'Modern Choice' },
    description: {
      RU: 'Идеальное сочетание комфорта и эстетики',
      EN: 'The perfect blend of comfort and aesthetics',
    },
    image: '/img/slider/Like.jpg',
  },
  {
    id: 4,
    title: { RU: 'Hush', EN: 'Hush' },
    subtitle: { RU: 'Элегантность и уют', EN: 'Elegance & Coziness' },
    description: {
      RU: 'Мягкие текстуры и глубокие оттенки',
      EN: 'Soft textures and deep hues',
    },
    image: '/img/slider/Hush.jpg',
  },
];

// Хук для отслеживания размера окна
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const SliderMenu = () => {
  const { theme, language } = useThemeLanguage();
  const [activeSlide, setActiveSlide] = useState(slides[0]);
  const swiperRef = useRef<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const size = useWindowSize();
  const isMobile = size.width ? size.width < 768 : false;

  // Классы для заголовков в зависимости от темы
  const titleClass =
    theme === 'dark'
      ? 'hidden md:block text-6xl font-bold text-gray-200'
      : 'hidden md:block text-6xl font-bold text-gray-800';
  const subtitleClass =
    theme === 'dark'
      ? 'hidden md:block text-lg text-gray-300 mt-2'
      : 'hidden md:block text-lg text-gray-600 mt-2';
  const descriptionClass =
    theme === 'dark'
      ? 'hidden md:block text-base text-gray-400 mt-2 font-semibold'
      : 'hidden md:block text-base text-gray-500 mt-2 font-semibold';

  const handleMouseEnter = (index: number) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    tooltipTimeout.current = setTimeout(() => setHoveredIndex(null), 2000);
  };

  return (
    <section className="relative w-full bg-white dark:bg-gray-900 overflow-hidden py-10 flex flex-col md:flex-row items-center justify-center">
      {/* Фоновая надпись */}
      <div className="pointer-events-none flex justify-center absolute md:inset-0 md:items-center w-full">
        <span className="text-[60px] md:text-[200px] font-bold text-gray-200 dark:text-gray-700 opacity-30 mt-[150px] md:mt-0">
          Союз-М ДВ
        </span>
      </div>

      <div className="w-full max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Текстовое описание для десктопа */}
        <div className="w-full md:w-1/2 px-6 md:px-10 relative text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeSlide.id + '-title'}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={titleClass}>
              {activeSlide.title[language]}
            </motion.h2>
            <motion.p
              key={activeSlide.id + '-subtitle'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={subtitleClass}>
              {activeSlide.subtitle[language]}
            </motion.p>
            <motion.p
              key={activeSlide.id + '-description'}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={descriptionClass}>
              {activeSlide.description[language]}
            </motion.p>
          </AnimatePresence>
        </div>
        {/* Слайдер */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <Swiper
            effect={isMobile ? 'slide' : 'coverflow'}
            speed={600}
            grabCursor={true}
            centeredSlides={!isMobile}
            slidesPerView={isMobile ? 1 : 1.8}
            breakpoints={{
              768: { slidesPerView: 1.8 },
            }}
            coverflowEffect={
              isMobile ? undefined : { rotate: 0, stretch: 0, depth: 200, modifier: 2 }
            }
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveSlide(slides[swiper.realIndex])}>
            {slides.map((slide, index) => (
              <SwiperSlide
                key={slide.id}
                className="relative group"
                onClick={() => {
                  if (!isMobile && swiperRef.current) {
                    swiperRef.current.slideToLoop(index);
                  } else if (swiperRef.current) {
                    swiperRef.current.slideTo(index);
                  }
                }}>
                <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center cursor-pointer">
                  <Image
                    src={slide.image}
                    alt={slide.title[language]}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                  <div
                    className="absolute bottom-4 left-4"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}>
                    <div className="relative inline-block">
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-200 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        +
                      </button>
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3 text-sm text-gray-800 bg-white rounded-xl shadow-lg border border-gray-300"
                            onMouseEnter={() => {
                              if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
                            }}
                            onMouseLeave={handleMouseLeave}>
                            {slide.description[language]}
                            <a
                              href="#"
                              className="block mt-2 px-4 py-2 bg-gray-700 text-white text-center rounded-lg hover:bg-gray-800 transition">
                              Перейти
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Текстовое описание для мобильной версии */}
      <div className="w-full px-6 md:px-10 text-center mt-6 md:hidden min-h-[160px]">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {activeSlide.title[language]}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          {activeSlide.subtitle[language]}
        </p>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-semibold">
          {activeSlide.description[language]}
        </p>
      </div>
      {/* Отключение coverflow для мобильной версии */}
      <style jsx global>{`
        @media (max-width: 767px) {
          .swiper-slide {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SliderMenu;
