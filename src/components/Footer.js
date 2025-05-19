import React from 'react';
import Link from 'next/link';

export function Footer() {
  // Hidden admin access through clicking period in copyright text
  const [clickCount, setClickCount] = React.useState(0);
  
  const handleHiddenClick = () => {
    setClickCount(prev => {
      if (prev >= 4) {
        // Navigate to admin page after 5 clicks
        window.location.href = '/admin';
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <footer className="py-8 bg-gradient-to-r from-honey-200 via-honey-300 to-honey-200 dark:from-honey-900 dark:via-honey-800 dark:to-honey-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <img 
                src="/image1.jpg" 
                alt="Yeet Logo" 
                className="w-12 h-12 rounded-full"
              />
              <h3 className="ml-3 text-xl font-heading font-bold text-honey-800 dark:text-honey-200">
                Yeet MEME Vault
              </h3>
            </div>
            <p className="mt-2 text-honey-700 dark:text-honey-300 text-center md:text-left">
              Serving sweet meme honey since 2025
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://x.com/RaveniumNFT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-honey-800 dark:text-honey-200 hover:text-honey-600 dark:hover:text-honey-400 transition-colors"
              >
                𝕏: @RaveniumNFT
              </a>
              <span className="text-honey-800 dark:text-honey-200">•</span>
              <span className="text-honey-800 dark:text-honey-200">Discord: ravenium22</span>
            </div>
            
            <p className="text-honey-700 dark:text-honey-300 text-sm">
              Made by yeetarded community member<span onClick={handleHiddenClick} className="cursor-default">.</span>
            </p>
          </div>
        </div>
        
        {/* Honeycomb Pattern Divider */}
        <div className="mt-8 pt-8 border-t border-honey-400 dark:border-honey-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <nav className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
              <Link href="/" className="text-honey-800 dark:text-honey-200 hover:text-honey-600 dark:hover:text-honey-400 transition-colors">
                Home
              </Link>
              <Link href="/hall" className="text-honey-800 dark:text-honey-200 hover:text-honey-600 dark:hover:text-honey-400 transition-colors">
                Hall of Yeetardation
              </Link>
            </nav>
            
            <p className="text-honey-700 dark:text-honey-300 text-sm">
              © {new Date().getFullYear()} Yeet MEME Vault. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
