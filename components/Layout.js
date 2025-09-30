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

  // Inicializar modo oscuro sin parpadeo
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'true' || (saved === null && prefersDark);
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

  // Cerrar menú al hacer scroll (móvil)
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen && window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Cerrar menú al navegar
  useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Overlay oscuro */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b-2 border-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <Link href="/" legacyBehavior>
                <a className={`block px-4 py-2 text-sm rounded-full text-white font-semibold ${activeCategory === 'home' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Inicio
                </a>
              </Link>
              {['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].map(cat => (
                <Link key={cat} href={`/noticia/${cat}`} legacyBehavior>
                  <a className={`block px-4 py-2 text-sm rounded-full text-white font-semibold ${activeCategory === cat ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
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

      {/* Header con botón de modo oscuro */}
      <header className="bg-white dark:bg-gray-900 border-b-4 border-blue-800 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden text-blue-900 dark:text-blue-200 hover:text-blue-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" legacyBehavior>
              <a>
                <img src="/logo.png" alt="UG Noticias Mineras" className="h-12 w-auto" />
              </a>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {/* ✅ BOTÓN DE MODO OSCURO VISIBLE EN TODOS LOS DISPOSITIVOS */}
            <button 
              onClick={toggleDarkMode}
              className="text-blue-900 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300 p-1"
              aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
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
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-blue-900 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-300"
              aria-label="Buscar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <div className="py-2 px-4 border-t border-blue-100 dark:border-blue-900">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-3 py-1.5 text-sm border border-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-lg">
                Buscar
              </button>
              <button onClick={() => setIsSearchOpen(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-3 py-1.5 text-sm rounded-lg">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Nav escritorio */}
      <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-blue-200 dark:border-blue-900 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <Link href="/" legacyBehavior>
              <a className={`px-4 py-1.5 text-sm rounded-full text-white font-semibold ${activeCategory === 'home' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                Inicio
              </a>
            </Link>
            {['sanjuan', 'nacionales', 'internacionales', 'sindicales', 'opinion'].map(cat => (
              <Link key={cat} href={`/noticia/${cat}`} legacyBehavior>
                <a className={`px-4 py-1.5 text-sm rounded-full text-white font-semibold ${activeCategory === cat ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {cat === 'nacionales' ? 'Nacionales' :
                   cat === 'sanjuan' ? 'San Juan' :
                   cat === 'sindicales' ? 'Sindicales' :
                   cat === 'internacionales' ? 'Internacionales' : 'Opinión'}
                </a>
              </Link>
            ))}
          </div>
          <div className="text-sm font-medium text-blue-900 dark:text-blue-200">
            {formatDate(currentDate)}
          </div>
        </div>
      </nav>

      {/* Fecha móvil */}
      <div className="lg:hidden bg-white dark:bg-gray-900 py-1.5 border-b border-blue-200 dark:border-blue-900 text-center">
        <div className="text-xs font-medium text-blue-900 dark:text-blue-200">
          {formatDate(currentDate)}
        </div>
      </div>

      {/* Banner de sponsors */}
      <div className="bg-blue-50 dark:bg-gray-800 border-b border-blue-100 dark:border-blue-900 overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <img
              key={i}
              src="/sponsors/aoma1.jpg"
              alt="Colaborador"
              className="h-10 mx-4 inline-block object-contain"
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      {/* Footer completo */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <Link href="/" legacyBehavior>
                <a className="flex items-center space-x-2">
                  <img 
                    src="/logo.png" 
                    alt="UG Noticias Mineras Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </a>
              </Link>
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.014-3.668.07-4.849.196-4.358 2.618-6.78 6.98-6.98C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.488.5.09.682-.216.682-.48 0-.236-.008-.864-.013-1.7-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.891 1.524 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.252-4.555-1.107-4.555-4.93 0-1.087.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.578 9.578 0 0112 6.835c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.639.696 1.029 1.588 1.029 2.675 0 3.833-2.337 4.675-4.566 4.921.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-700 text-center">
            <p className="text-blue-300 text-sm">
              Comprometidos con la información veraz y el desarrollo sostenible de la minería argentina
            </p>
            <p className="text-blue-200 text-sm mt-1">Contacto: ugnoticiasmineras@gmail.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}