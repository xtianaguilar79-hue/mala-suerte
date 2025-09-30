// components/Layout.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, currentDate }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const getActiveCategory = () => {
    const path = router.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/noticia/')) {
      const parts = router.asPath.split('/');
      if (parts.length >= 3) {
        const cat = parts[2];
        if (['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].includes(cat)) {
          return cat;
        }
      }
    }
    return 'home';
  };

  const activeCategory = getActiveCategory();

  // ✅ Modo oscuro: ejecutar lo antes posible
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'true' || (saved === null && systemPrefersDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Cerrar menú al scroll o navegar (igual que antes)
  useEffect(() => {
    const handleScroll = () => mobileMenuOpen && window.innerWidth < 1024 && setMobileMenuOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleRoute = () => setMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleRoute);
    return () => router.events.off('routeChangeStart', handleRoute);
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b-2 border-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              <Link href="/" legacyBehavior>
                <a className={`px-4 py-1 text-sm ${activeCategory === 'home' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white font-semibold rounded-full`}>
                  Inicio
                </a>
              </Link>
              {['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].map(cat => (
                <Link key={cat} href={`/noticia/${cat}`} legacyBehavior>
                  <a className={`px-4 py-1 text-sm ${activeCategory === cat ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white font-semibold rounded-full`}>
                    {cat === 'nacionales' ? 'Nacionales' :
                     cat === 'sanjuan' ? 'San Juan' :
                     cat === 'sindicales' ? 'Sindicales' :
                     cat === 'internacionales' ? 'Internacionales' : 'Opinión'}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-gray-900 border-b-4 border-blue-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-blue-900 dark:text-blue-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" legacyBehavior>
              <a><img src="/logo.png" alt="Logo" className="h-12" /></a>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleDarkMode} className="text-blue-900 dark:text-blue-200">
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-blue-900 dark:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <div className="py-2 px-4 border-t border-blue-100 dark:border-blue-900">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="px-3 py-1 w-full border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
      </header>

      {/* NAV DESKTOP */}
      <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-900 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Link href="/" legacyBehavior><a className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Inicio</a></Link>
            {['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].map(cat => (
              <Link key={cat} href={`/noticia/${cat}`} legacyBehavior>
                <a className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                  {cat === 'nacionales' ? 'Nacionales' :
                   cat === 'sanjuan' ? 'San Juan' :
                   cat === 'sindicales' ? 'Sindicales' :
                   cat === 'internacionales' ? 'Internacionales' : 'Opinión'}
                </a>
              </Link>
            ))}
          </div>
          <div className="text-sm text-blue-900 dark:text-blue-200">{formatDate(currentDate)}</div>
        </div>
      </nav>

      {/* FECHA MÓVIL */}
      <div className="lg:hidden bg-white dark:bg-gray-900 py-1 border-b border-blue-200 dark:border-blue-900 text-center text-xs text-blue-900 dark:text-blue-200">
        {formatDate(currentDate)}
      </div>

      {/* ✅ SPONSORS CORREGIDO */}
      <div className="bg-blue-50 dark:bg-gray-800 border-b border-blue-100 dark:border-blue-900 overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <img
              key={i}
              src="/sponsors/aoma1.jpg"
              alt="Sponsor"
              className="h-12 mx-4 object-contain inline-block"
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>

      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-8 py-6 text-center">
        <p className="text-blue-200">Contacto: ugnoticiasmineras@gmail.com</p>
      </footer>
    </>
  );
}
