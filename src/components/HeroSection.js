import React from 'react';
import Link from 'next/link';

export function HeroSection({ showHallTitle = false }) {
  const title = showHallTitle ? "Hall of Yeetardation" : "Yeet MEME Vault";
  const subtitle = showHallTitle 
    ? "A sweet collection of the finest Yeet tattoos from yeetarded persons around the world" 
    : "Your exclusive honeypot of the sweetest memes on the internet";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-honey-200 to-honey-400 dark:from-honey-800 dark:to-honey-700 mb-12">
      {/* Honeycomb Pattern Background */}
      <div className="absolute inset-0 opacity-10 bg-honeycomb-pattern"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Floating Honey Drop Animation */}
        <div className="relative mb-4">
          <div className="absolute left-1/2 -ml-16 -top-12 w-32 h-32 rounded-full bg-honey-500 opacity-20 animate-float"></div>
          <img 
            src="/image1.jpg" 
            alt="Yeet Logo" 
            className="w-32 h-32 mx-auto mb-6 rounded-full shadow-lg border-4 border-white dark:border-honey-600 relative z-10 honey-hover-grow"
          />
          <div className="absolute h-16 w-4 bg-gradient-to-b from-honey-500 to-honey-600 rounded-full left-1/2 -ml-2 -top-6 opacity-30 animate-honey-drip"></div>
        </div>
        
        <h1 className="title-text text-5xl md:text-7xl font-bold mb-4">
          {title}
        </h1>
        
        <p className="text-xl text-honey-800 dark:text-honey-200 max-w-2xl mx-auto mb-8">
          {subtitle}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className={`btn-honey-${!showHallTitle ? 'primary' : 'secondary'}`}>
            Meme Vault
          </Link>
          <Link href="/hall" className={`btn-honey-${showHallTitle ? 'primary' : 'secondary'}`}>
            Hall of Yeetardation
          </Link>
        </div>
      </div>
      
      {/* Honey Drip Effect at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-honey-drip bg-repeat-x bg-bottom"></div>
    </div>
  );
}