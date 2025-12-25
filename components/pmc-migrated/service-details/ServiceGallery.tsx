// Service Gallery component (matching original PMC design)
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/450?grayscale';

interface ServiceGalleryProps {
  images: string[];
  videoUrl?: string;
  title: string;
}

export default function ServiceGallery({ images, videoUrl, title }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageSources, setImageSources] = useState<string[]>([]);

  // Initialize image sources with fallback for empty arrays
  useEffect(() => {
    const validImages = images.filter(Boolean);
    setImageSources(validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE]);
  }, [images]);

  const allMedia = videoUrl ? [videoUrl, ...imageSources] : imageSources;

  // Handle image load error
  const handleImageError = (index: number) => {
    setImageSources(prev => {
      const updated = [...prev];
      updated[index] = PLACEHOLDER_IMAGE;
      return updated;
    });
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const isVideo = (url: string) => {
    return url.includes('youtube') || url.includes('vimeo') || url.endsWith('.mp4');
  };

  return (
    <>
      {/* Service Preview - Original PMC dark background style */}
      <div className="service-preview mb-5">
        {/* Main Image/Video */}
        <div className="main-image relative">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            {activeIndex === 0 && videoUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <button
                  onClick={() => openLightbox(0)}
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/90 hover:bg-primary transition-colors"
                >
                  <Play className="h-8 w-8 text-white ml-1" />
                </button>
              </div>
            ) : (
              <Image
                src={allMedia[activeIndex] || PLACEHOLDER_IMAGE}
                alt={`${title} - Image ${activeIndex + 1}`}
                fill
                className="object-cover cursor-pointer"
                onClick={() => openLightbox(activeIndex)}
                unoptimized
                onError={() => handleImageError(activeIndex)}
              />
            )}
          </div>

          {/* Navigation Arrows - PMC Style */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails - PMC Style */}
        {allMedia.length > 1 && (
          <div className="thumbnail-strip flex gap-2 justify-center mt-3">
            {allMedia.map((media, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`thumbnail-item relative flex-shrink-0 w-[100px] h-[60px] ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                {index === 0 && videoUrl ? (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <Image
                    src={media || PLACEHOLDER_IMAGE}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    unoptimized
                    onError={() => handleImageError(videoUrl ? index - 1 : index)}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={() => setLightboxIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))}
            className="absolute left-4 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="max-w-5xl max-h-[80vh] relative">
            {lightboxIndex === 0 && videoUrl ? (
              <div className="aspect-video bg-black">
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Service Video"
                />
              </div>
            ) : (
              <Image
                src={allMedia[lightboxIndex] || PLACEHOLDER_IMAGE}
                alt={`${title} - Image ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh]"
                unoptimized
                onError={() => handleImageError(lightboxIndex)}
              />
            )}
          </div>

          <button
            onClick={() => setLightboxIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))}
            className="absolute right-4 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setLightboxIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  lightboxIndex === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
