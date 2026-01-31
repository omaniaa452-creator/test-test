/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons';

type Props = {
  isOpen: boolean;
  title?: string;
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

export default function GalleryModal({ isOpen, title, images, startIndex = 0, onClose }: Props) {
  const safeImages = useMemo(() => Array.isArray(images) ? images.filter(Boolean) : [], [images]);

  useEffect(() => {
    if (!isOpen) return;

    // Back button should close modal
    const push = () => {
      try {
        // Preserve query/hash (e.g., ?preset=...) so opening the gallery doesn't erase deep-link state.
        const url = window.location.pathname + window.location.search + window.location.hash;
        window.history.pushState({ modal: 'gallery' }, '', url);
      } catch {}
    };

    const onPop = () => {
      onClose();
    };

    push();
    window.addEventListener('popstate', onPop);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', onPop);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const [index, setIndex] = React.useState<number>(startIndex);
  const [galleryImgLoaded, setGalleryImgLoaded] = React.useState<boolean>(false);


  useEffect(() => {
    if (!isOpen) return;
    setGalleryImgLoaded(false);
    setIndex(Math.min(Math.max(0, startIndex), Math.max(0, safeImages.length - 1)));
  }, [isOpen, startIndex, safeImages.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, safeImages.length - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, safeImages.length]);

  if (!isOpen) return null;

  const canPrev = index > 0;
  const canNext = index < safeImages.length - 1;
  const hasImages = safeImages.length > 0;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" title={title || ''}>{title || 'الصور'}</div>
          <button className="icon-btn" aria-label="إغلاق" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="modal-body">
          <div className="gallery-stage">
            <button
              className="gallery-nav left"
              disabled={!canPrev}
              aria-label="السابق"
              onClick={() => setIndex(i => Math.max(i - 1, 0))}
            >
              <ChevronLeftIcon />
            </button>

            <div className={`gallery-skeleton${galleryImgLoaded ? " is-loaded" : ""}`} aria-hidden="true" />

            {hasImages ? (
              <img
                className={`gallery-image${galleryImgLoaded ? " is-loaded" : ""}`}
                src={safeImages[index]}
                alt={title || 'صورة'}
                loading="lazy"
                decoding="async"
                onLoad={() => setGalleryImgLoaded(true)}
                onError={() => setGalleryImgLoaded(true)}
              />
            ) : (
              <div className="gallery-empty">لا توجد صور متاحة</div>
            )}

            <button
              className="gallery-nav right"
              disabled={!canNext}
              aria-label="التالي"
              onClick={() => setIndex(i => Math.min(i + 1, safeImages.length - 1))}
            >
              <ChevronRightIcon />
            </button>
          </div>

          {safeImages.length > 1 && (
            <div className="gallery-thumbs" aria-label="مصغرات الصور">
              {safeImages.map((src, i) => (
                <button
                  key={src + i}
                  className={`thumb ${i === index ? 'active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`صورة ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
