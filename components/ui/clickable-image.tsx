'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | '4/3';
  sizes?: string;
  caption?: string;
}

export function ClickableImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'video',
  sizes = '100vw',
  caption
}: ClickableImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Keyboard navigation and body scroll lock
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const aspectClasses = {
    'video': 'aspect-video',
    'square': 'aspect-square',
    '4/3': 'aspect-[4/3]',
  };

  return (
    <>
      {/* Clickable Image */}
      <button
        onClick={openLightbox}
        className={`group relative w-full overflow-hidden cursor-zoom-in ${aspectClasses[aspectRatio]} ${className}`}
        aria-label="Click pentru a mări imaginea"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={sizes}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" />
        </div>
      </button>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Închide"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div 
            className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {caption && (
              <p className="mt-4 text-white/90 text-center max-w-2xl px-4">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
