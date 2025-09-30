/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // incluido por si usas App Router en el futuro
  ],
  darkMode: 'class', // Activa el modo oscuro mediante la clase 'dark' en <html>
  theme: {
    extend: {
      colors: {
        // Colores personalizados (puedes ajustarlos si lo deseas)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        red: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
      height: {
        'sponsor-banner-height': '4rem', // 64px – ajustable
      },
    },
  },
  plugins: [],
};
