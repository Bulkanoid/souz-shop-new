'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, CircleUser, ShoppingCart, Sun, Moon, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useThemeLanguage } from '@/context/themeLanguageContext';
import { useCategories } from '@/hooks/useCategories';
import './Header.css';

// Словарь переводов
const translations = {
  RU: {
    login: 'Войти',
    news: 'Новости',
    catalog: 'Каталог',
    phones: 'Телефоны',
    search: 'Поиск',
    about: 'О нас',
    contacts: 'Контакты',
    language: 'Язык',
    theme: 'Тема',
    address: 'Адрес',
    phonesLabel: 'Телефоны',
    email: 'Email',
    cart: 'Корзина',
    cartSum: 'Сумма товаров:',
    account: 'Аккаунт',
    searchPlaceholder: 'Введите запрос...',
    searchResults: 'Результаты поиска:',
  },
  EN: {
    login: 'Login',
    news: 'News',
    catalog: 'Catalog',
    phones: 'Phones',
    search: 'Search',
    about: 'About Us',
    contacts: 'Contacts',
    language: 'Language',
    theme: 'Theme',
    address: 'Address',
    phonesLabel: 'Phones',
    email: 'Email',
    cart: 'Cart',
    cartSum: 'Total:',
    account: 'Account',
    searchPlaceholder: 'Enter search query...',
    searchResults: 'Search results:',
  },
};

// Компонент Tooltip, позиционированный снизу
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-lg shadow-lg bg-white text-gray-800 dark:bg-gray-700 dark:text-white">
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Кастомный переключатель (Switch)
function CustomSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      className={`relative w-12 h-7 flex items-center rounded-full cursor-pointer transition-all duration-300 shadow-lg ${
        checked ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-400 dark:bg-gray-600'
      }`}
      onClick={onChange}>
      <div
        className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </div>
  );
}

export default function Header() {
  // Получаем тему и язык из контекста
  const { theme, language, toggleTheme, toggleLanguage } = useThemeLanguage();

  // Локальные состояния для модальных окон и панелей
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartPanelOpen, setCartPanelOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [phoneListOpen, setPhoneListOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalSearchResults, setModalSearchResults] = useState<string[]>([]);
  const searchHoldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { categories, isLoading } = useCategories();

  // Состояния для аккаунта и корзины
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartTotal, setCartTotal] = useState(1500);

  // Dummy данные для поиска, каталога и контактов
  const dummySearchData = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  // const catalogOptions = ['ткань', 'поролон', 'механизмы', 'фурнитура'];
  const contactsData = {
    address: 'ул. Примерная, 123, Москва',
    phones: [
      '+7 (495) 123-45-67',
      '+7 (495) 234-56-78',
      '+7 (495) 345-67-89',
      '+7 (495) 456-78-90',
    ],
    emails: ['info@example.com', 'support@example.com'],
  };

  // Получаем переводы согласно выбранному языку
  const t = translations[language as 'RU' | 'EN'];

  // Унифицированные классы для кнопок меню (desktop)
  const menuBtnClasses =
    'hover:bg-accent text-gray-700 dark:text-white font-roboto font-medium text-base py-2 px-4 rounded-lg';

  // Для динамического изменения цвета кнопок закрытия
  const closeBtnColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';

  // Обработчики для открытия/закрытия модальных окон и панелей
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const togglePhoneList = () => setPhoneListOpen((prev) => !prev);
  const toggleCatalog = () => setCatalogOpen((prev) => !prev);
  const toggleContacts = () => setContactsOpen((prev) => !prev);
  const toggleCartPanel = () => setCartPanelOpen((prev) => !prev);

  // Фейковая авторизация
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Открытие/закрытие модального окна поиска
  const openSearchModal = () => setSearchModalOpen(true);
  const closeSearchModal = () => {
    setSearchModalOpen(false);
    setModalSearchQuery('');
    setModalSearchResults([]);
  };

  // Обработка ввода в модальном окне поиска
  const handleModalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setModalSearchQuery(query);
    const results = dummySearchData.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase()),
    );
    setModalSearchResults(results);
  };

  // Обработчики долгого нажатия на кнопку поиска (2 секунды)
  const handleSearchMouseDown = () => {
    searchHoldTimeoutRef.current = setTimeout(() => {
      openSearchModal();
    }, 2000);
  };
  const handleSearchMouseUp = () => {
    if (searchHoldTimeoutRef.current) clearTimeout(searchHoldTimeoutRef.current);
  };

  useEffect(() => {
    if (menuOpen || cartPanelOpen || searchModalOpen) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [menuOpen, cartPanelOpen, searchModalOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-50">
      {/* Основной контейнер шапки */}
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Левая часть: в мобильном – кнопка меню, в десктопе – логотип */}
        <div className="flex items-center">
          {/* Мобильное разрешение */}
          <div className="lg:hidden">
            <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
              {menuOpen ? (
                <X size={24} className={closeBtnColor} />
              ) : (
                <Menu size={24} className={closeBtnColor} />
              )}
            </Button>
          </div>
          {/* Десктопное разрешение */}
          <Link
            href="/"
            className="hidden lg:block text-xl font-bold text-gray-800 dark:text-white font-playfair">
            Logo
          </Link>
        </div>

        {/* Правая часть: навигация и блок аккаунта/корзины */}
        <div className="flex justify-center items-center space-x-4">
          {/* Навигация для больших экранов с подсказками */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Tooltip text={t.news}>
              <a href="/news" className={menuBtnClasses}>
                {t.news}
              </a>
            </Tooltip>
            <Tooltip text={t.catalog}>
              <a href="/catalog" className={menuBtnClasses}>
                {t.catalog}
              </a>
            </Tooltip>
            <Tooltip text={t.phones}>
              <Button variant="ghost" onClick={togglePhoneList} className={menuBtnClasses}>
                {t.phones}
              </Button>
            </Tooltip>
            {phoneListOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bg-white dark:bg-gray-700 shadow-lg rounded-lg mt-2 p-4 space-y-2 z-20">
                <li>+1 (234) 567-890</li>
                <li>+1 (987) 654-321</li>
              </motion.ul>
            )}
            <Tooltip text={t.search}>
              <Button
                variant="ghost"
                onClick={openSearchModal}
                onMouseDown={handleSearchMouseDown}
                onMouseUp={handleSearchMouseUp}
                className={menuBtnClasses}>
                {t.search}
              </Button>
            </Tooltip>
          </nav>
        </div>

        {/* Блок аккаунта и корзины */}
        <div className="flex justify-end">
          <Tooltip text={isAuthenticated ? t.account : t.login}>
            {isAuthenticated ? (
              <Button variant="ghost" className="rounded-lg">
                <CircleUser size={24} />
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleLogin} className="rounded-lg">
                {t.login}
              </Button>
            )}
          </Tooltip>
          <Tooltip text={t.cart}>
            <Button
              variant="ghost"
              onClick={toggleCartPanel}
              className={`relative rounded-lg ${cartPanelOpen ? 'bg-accent text-white' : ''}`}>
              <ShoppingCart size={24} />
              {cartTotal > 0 && (
                <motion.span
                  animate={{ scale: [0.8, 1.2, 1] }}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartTotal}₽
                </motion.span>
              )}
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" fixed inset-0 bg-gray-800 bg-opacity-90 flex flex-col justify-between text-white z-40 p-6 rounded-lg overflow-y-auto max-h-screen">
            {/* Кнопка закрытия мобильного меню */}
            <Button
              variant="ghost"
              onClick={toggleMenu}
              aria-label="Close menu"
              className="absolute top-4 right-4">
              <X size={24} className={closeBtnColor} />
            </Button>

            {/* Верхняя часть меню */}
            <div className="w-full">
              {/* Блок переключения языка и темы */}
              <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mx-auto mb-20">
                <div className="grid grid-cols-2 gap-6">
                  {/* Переключение языка */}
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {t.language}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${
                          language === 'RU' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                        RU
                      </span>
                      <CustomSwitch checked={language === 'EN'} onChange={toggleLanguage} />
                      <span
                        className={`text-sm font-medium ${
                          language === 'EN' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                        EN
                      </span>
                    </div>
                  </div>

                  {/* Переключение темы */}
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {t.theme}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Sun
                        size={20}
                        className={`transition-colors ${
                          theme === 'light' ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      />
                      <CustomSwitch checked={theme === 'dark'} onChange={toggleTheme} />
                      <Moon
                        size={20}
                        className={`transition-colors ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Основное мобильное меню */}
              <ul className="text-left space-y-6 text-xl w-full max-w-xs mx-auto">
                <li>
                  <button
                    onClick={toggleCatalog}
                    className="w-full text-left hover:underline focus:outline-none rounded-lg">
                    {t.catalog}
                  </button>
                  <AnimatePresence>
                    {catalogOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-4 border-l border-gray-500 space-y-2 rounded-lg">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <a href={`/catalog/${category.id}`} className="hover:underline">
                              {language === 'RU' ? category.name_ru : category.name_en}
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <a href="/about" className="hover:underline rounded-lg">
                    {t.about}
                  </a>
                </li>
                <li>
                  <a href="/news" className="hover:underline rounded-lg">
                    {t.news}
                  </a>
                </li>
                <li>
                  <button
                    onClick={toggleContacts}
                    className="w-full text-left hover:underline focus:outline-none rounded-lg">
                    {t.contacts}
                  </button>
                  <AnimatePresence>
                    {contactsOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 pl-4 border-l border-gray-500 space-y-2 text-sm text-gray-200 rounded-lg">
                        <li>
                          <strong>{t.address}:</strong> {contactsData.address}
                        </li>
                        <li>
                          <strong>{t.phonesLabel}:</strong>
                          <ul className="mt-1 ml-4 space-y-1">
                            {contactsData.phones.map((phone, idx) => (
                              <li key={idx}>{phone}</li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <strong>{t.email}:</strong>
                          <ul className="mt-1 ml-4 space-y-1">
                            {contactsData.emails.map((email, idx) => (
                              <li key={idx}>{email}</li>
                            ))}
                          </ul>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              </ul>
            </div>

            {/* Нижняя часть меню — ссылки на социальные сети */}
            <div className="w-full">
              <div className="flex justify-center space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 rounded-lg">
                  <Instagram size={24} />
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 rounded-lg">
                  <Send size={24} />
                </a>
                <a
                  href="https://vk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 rounded-lg">
                  {/* Пример кастомной иконки VK */}
                  <svg
                    className="rounded-lg"
                    width={24}
                    height={24}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="4" />
                    <text
                      x="32"
                      y="42"
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="20"
                      fontFamily="Arial, sans-serif">
                      VK
                    </text>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Панель корзины */}
      <AnimatePresence>
        {cartPanelOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 h-full w-full lg:w-1/3 bg-white dark:bg-gray-800 shadow-lg z-50 p-6 overflow-y-auto rounded-lg"
            style={{ top: '70px' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{t.cart}</h2>
              <Button variant="ghost" onClick={toggleCartPanel} aria-label="Close cart">
                <X size={24} className={closeBtnColor} />
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t.cartSum} <span className="font-bold">{cartTotal}₽</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">Товар 1 — 500₽</p>
              <p className="text-gray-700 dark:text-gray-300">Товар 2 — 1000₽</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно поиска */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-start z-50"
            style={{ paddingTop: '80px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {t.search}
                </h2>
                <Button variant="ghost" onClick={closeSearchModal} aria-label="Close search modal">
                  <X size={24} className={closeBtnColor} />
                </Button>
              </div>
              <input
                type="text"
                value={modalSearchQuery}
                onChange={handleModalSearchChange}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
              />
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.searchResults}
                </h3>
                <ul className="space-y-1">
                  {modalSearchResults.length > 0 ? (
                    modalSearchResults.map((item, idx) => (
                      <li
                        key={idx}
                        className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-1 text-gray-500 dark:text-gray-400">—</li>
                  )}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
