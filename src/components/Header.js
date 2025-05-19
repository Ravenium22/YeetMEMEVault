import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Header({ showHallTitle }) {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const title = showHallTitle ? "Hall of Yeetardation" : "Yeet MEME Vault";

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-2 bg-honey-500/95 backdrop-blur-sm shadow-md' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className={`overflow-hidden rounded-full transition-all duration-300 ${
              isScrolled ? 'w-10 h-10' : 'w-16 h-16'
            }`}>
              <img 
                src="/image1.jpg"
                alt="Yeet Logo" 
                className="w-full h-full object-cover honey-hover-grow"
              />
            </div>
            <h1 className={`ml-3 font-heading font-bold transition-all duration-300 ${
              isScrolled 
                ? 'text-white text-xl' 
                : 'text-honey-800 dark:text-honey-100 text-2xl'
            }`}>
              {title}
            </h1>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className={`nav-link ${!showHallTitle ? 'active' : ''}`}
            >
              Meme Vault
            </Link>
            <Link 
              href="/hall" 
              className={`nav-link ${showHallTitle ? 'active' : ''}`}
            >
              Hall of Yeetardation
            </Link>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`ml-4 p-2 rounded-full transition-all ${
                isScrolled 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-honey-100 dark:bg-honey-800 text-honey-800 dark:text-honey-100 hover:bg-honey-200 dark:hover:bg-honey-700'
              }`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              className={`p-2 rounded-lg ${
                isScrolled 
                  ? 'text-white hover:bg-white/20' 
                  : 'text-honey-800 dark:text-honey-100 hover:bg-honey-100 dark:hover:bg-honey-800'
              }`}
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
