import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Header({ isAdmin }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="py-8 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <img 
            src="/image1.jpg"
            alt="Yeet Logo" 
            className="w-24 h-24 mb-4 rounded-full"
          />
          <h1 className="title-text text-6xl text-center transform hover:scale-105 transition-transform duration-300">
            Yeet MEME Vault {isAdmin ? '- Admin' : ''}
          </h1>
          {!isAdmin && (
            <div className="w-full max-w-2xl mt-6">
              <img 
                src="/image2.jpg"
                alt="Yeet Banner" 
                className="w-full h-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}