// Product Preview component with image gallery (matching original PMC design exactly)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Columns, ArrowUpRight, Image as ImageIcon, Tag, Zap } from 'lucide-react';

interface ProductPreviewProps {
  previewImage: string;
  previewLink: string;
  previewAlt?: string;
  screenshots: string[];
  trendingStatus?: boolean;
  isOnSale?: boolean;
}

interface ImageDimension {
  url: string;
  width: number;
  height: number;
}

export default function ProductPreview({
  previewImage,
  previewLink,
  previewAlt = '',
  screenshots,
  trendingStatus,
  isOnSale,
}: ProductPreviewProps) {
  const [dimensions, setDimensions] = useState<ImageDimension[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDimensions = async () => {
      const updatedImages = await Promise.all(
        screenshots.map((img) => {
          return new Promise<ImageDimension>((resolve) => {
            const image = document.createElement('img');
            image.src = img;
            image.onload = () => {
              resolve({
                url: img,
                width: image.naturalWidth || 1200,
                height: image.naturalHeight || 800,
              });
            };
            image.onerror = () => {
              resolve({ url: img, width: 1200, height: 800 });
            };
          });
        })
      );
      setDimensions(updatedImages);
    };

    if (screenshots?.length > 0) {
      fetchDimensions();
    }
  }, [screenshots]);

  const openLightbox = (index: number = 0) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dimensions.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + dimensions.length) % dimensions.length);
  };

  return (
    <>
      <div className="bgc-dark mb-2 p-2 sm:p-3 relative rounded-2">
        {/* Ribbons */}
        {trendingStatus && (
          <div className="ribbon trending">
            <Zap className="w-4 h-4" />
            Trending
          </div>
        )}
        {isOnSale && (
          <div className="ribbon sale">
            <Tag className="w-4 h-4" />
            On Sale
          </div>
        )}

        {/* Preview Image */}
        <div className="preview-image-thumb relative group">
          <Image
            src={previewImage}
            alt={previewAlt}
            width={785}
            height={400}
            className="w-full h-auto"
            style={{ width: '100%', height: 'auto' }}
            unoptimized
          />
          <Link
            href={previewLink}
            target="_blank"
            className="preview-overlay absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"
          >
            <div className="text-center">
              <Columns size={80} />
              <div className="flex items-center gap-2 mt-2 justify-center">
                Live Preview
                <ArrowUpRight size={16} />
              </div>
            </div>
          </Link>
        </div>

        {/* Action Buttons - matching original: d-flex flex-wrap gap-2 justify-content-center mt-2 mt-sm-3 */}
        <div className="flex flex-wrap gap-2 justify-center mt-2 sm:mt-3">
          <Link
            href={previewLink}
            target="_blank"
            className="ud-btn btn-thm px-4 py-2 rounded-2"
          >
            Live Preview
            <Columns size={18} className="ms-2 inline-block" />
          </Link>
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="ud-btn btn-soft-primary px-4 py-2 rounded-2"
          >
            Screenshots
            <ImageIcon size={18} className="ms-2 inline-block" />
          </button>
        </div>
      </div>

      {/* Custom Lightbox */}
      {lightboxOpen && dimensions.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            onClick={closeLightbox}
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {dimensions.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={dimensions[currentIndex].url}
              alt={`Screenshot ${currentIndex + 1}`}
              width={dimensions[currentIndex].width}
              height={dimensions[currentIndex].height}
              className="max-w-full max-h-[90vh] object-contain"
              unoptimized
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {dimensions.length}
          </div>
        </div>
      )}
    </>
  );
}
