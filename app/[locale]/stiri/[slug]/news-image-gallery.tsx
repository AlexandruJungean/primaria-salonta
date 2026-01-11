'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { NewsImage } from '@/lib/types/database';

interface NewsImageGalleryProps {
  images: NewsImage[];
}

export function NewsImageGallery({ images }: NewsImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      {/* Grid Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || `Imagine ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs line-clamp-1">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie foto"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Închide"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 text-white/80 text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 z-10 p-2 text-white/80 hover:text-white transition-colors rounded-full bg-black/30 hover:bg-black/50"
              aria-label="Imaginea anterioară"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Main image */}
          <div 
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].image_url}
              alt={images[selectedIndex].alt_text || `Imagine ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 z-10 p-2 text-white/80 hover:text-white transition-colors rounded-full bg-black/30 hover:bg-black/50"
              aria-label="Imaginea următoare"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Caption */}
          {images[selectedIndex].caption && (
            <div className="absolute bottom-4 left-0 right-0 text-center px-4">
              <p className="text-white/90 text-sm max-w-2xl mx-auto">
                {images[selectedIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
