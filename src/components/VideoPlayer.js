import React, { useState, useRef, useEffect } from 'react';

export function VideoPlayer({ src, thumbnail, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Try to fix the source URL if needed
  const videoSrc = src.startsWith('http') ? src : `https:${src}`;

  // Fix Cloudinary video URLs if needed
  useEffect(() => {
    if (videoRef.current) {
      // For debug purposes
      console.log("Video element:", videoRef.current);
      console.log("Video source:", videoSrc);
    }
  }, [videoSrc]);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // Try to play and handle any errors
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Playback started successfully
            setIsPlaying(true);
          }).catch(error => {
            // Auto-play was prevented or another error occurred
            console.error("Video play error:", error);
            // Try with muted, as browsers often allow muted autoplay
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(e => {
              console.error("Even muted playback failed:", e);
              setHasError(true);
            });
          });
        }
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
    setHasError(false);
    if (autoPlay) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Autoplay prevented:", error);
          // Keep the video in a paused state
          setIsPlaying(false);
        });
      }
    }
  };

  const handleError = (e) => {
    console.error("Video error:", e);
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading state or Error state */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-honey-900/50">
          {thumbnail && !hasError ? (
            <img 
              src={thumbnail} 
              alt="Video thumbnail" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : hasError ? (
            <div className="text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white text-sm">Video playback error</p>
              <a href={videoSrc} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-xs underline mt-1 block">
                Open video directly
              </a>
            </div>
          ) : (
            <div className="animate-pulse flex space-x-2">
              <div className="h-3 w-3 bg-honey-500 rounded-full"></div>
              <div className="h-3 w-3 bg-honey-500 rounded-full"></div>
              <div className="h-3 w-3 bg-honey-500 rounded-full"></div>
            </div>
          )}
        </div>
      )}
        {/* Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain z-10"
        onClick={togglePlay}
        onLoadedData={handleLoadedData}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleError}
        playsInline
        loop
        muted={isMuted}
        poster={thumbnail}
        preload="metadata"
      >
        {/* Add fallback source formats */}
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
        {/* Play button overlay */}
      {!isPlaying && isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <div className="bg-honey-500/70 hover:bg-honey-500/90 transition-colors rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-10 right-4 z-10 bg-honey-800/70 hover:bg-honey-800/90 text-white rounded-full p-2 transition-colors"
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
        {/* Video indicator */}
      <div className="absolute top-2 right-2 bg-honey-500/80 text-white rounded-full px-2 py-1 text-xs font-medium">
        VIDEO
      </div>
      
      {/* Custom controls */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="bg-honey-800/70 hover:bg-honey-800/90 text-white rounded-full p-2 mx-1 transition-colors"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
