/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';
import { STORE_CONFIG } from '../data/store.config';
import { contactForProduct, getPrimaryChannel, getSecondaryChannel } from '../order';
import { MessengerIcon, WhatsappIcon, CloseIcon, ImageIcon } from './Icons';

interface ProductSheetProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onOpenGallery: (product: Product, startIndex?: number) => void;
}

const ProductSheet: React.FC<ProductSheetProps> = ({ isOpen, product, onClose, onOpenGallery }) => {
  const sheetRef = React.useRef<HTMLDivElement | null>(null);
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startY = React.useRef<number | null>(null);
  const galleryLock = React.useRef(false);

  const primary = getPrimaryChannel();
  const secondary = getSecondaryChannel();

  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      startY.current = null;
    }
  }, [isOpen]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const code = `${STORE_CONFIG.productCodePrefix}-${String(product.id).padStart(3, '0')}`;

  const heroSrc = React.useMemo(() => {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const placeholder = `${base}assets/placeholder-product.svg`;
    if (typeof product.image === 'string' && product.image.trim()) return product.image;
    if (product.images && product.images.length) {
      const first = product.images.find((u) => typeof u === 'string' && u.trim());
      if (first) return first;
    }
    return placeholder;
  }, [product]);

  const handlePrimary = () => {
    if (product.isSoldOut) return;
    contactForProduct(product, primary);
  };

  const handleSecondary = () => {
    if (product.isSoldOut) return;
    contactForProduct(product, secondary);
  };

  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current == null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setDragY(0);
      return;
    }
    setDragY(Math.min(delta, 240));
  };

  const onTouchEnd = () => {

    const threshold = 90;
    if (dragY > threshold) {
      onClose();
      return;
    }
    setDragY(0);
    setIsDragging(false);
    startY.current = null;
  };


  const onTouchCancel = () => {
    setDragY(0);
    setIsDragging(false);
    startY.current = null;
  };
  const imagesCount = (product.images && product.images.length ? product.images.length : 1);
  const hasGallery = imagesCount > 1;

  const handleOpenGallery = () => {
    if (!hasGallery) return;
    if (galleryLock.current) return;
    galleryLock.current = true;
    try {
      onOpenGallery(product, 0);
    } finally {
      window.setTimeout(() => { galleryLock.current = false; }, 450);
    }
  };

  return (
    <div className="sheet-overlay" onClick={onOverlayClick} aria-hidden={!isOpen}>
      <div
        className={`product-sheet ${isDragging ? 'dragging' : ''}`}
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={STORE_CONFIG.copy.ui.productSheetAriaLabel}
        style={{ transform: `translateY(${dragY}px)` }}
>
        <div className="sheet-drag-area"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        >
          <div className="sheet-handle" aria-hidden="true" />

          <div className="sheet-header">
          <div className="sheet-title-wrap">
            <div className="sheet-title">{product.name}</div>
            <div className="sheet-subtitle">
              <span style={{ fontWeight: 700 }}>{STORE_CONFIG.copy.ui.codeLabel}: {code}</span>
              <span className="sheet-dot">•</span>
              <span>{product.availabilityLabel || STORE_CONFIG.copy.ui.availabilityFallback}</span>
            </div>
          </div>
          <button type="button" className="sheet-close" onClick={onClose} aria-label={STORE_CONFIG.copy.ui.closeLabel}>
            <CloseIcon />
          </button>
          </div>
        </div>

        <div className="sheet-body">
          <div className="sheet-hero">
            <img src={heroSrc} alt={product.name} loading="lazy" decoding="async" onError={(e) => { (e.currentTarget as HTMLImageElement).src = ((import.meta as any).env?.BASE_URL || '/') + 'assets/placeholder-product.svg'; }} />
            {product.isSoldOut && (
              <div className="sheet-soldout">
                <span>{STORE_CONFIG.copy.ui.soldOutOverlay}</span>
              </div>
            )}
          </div>

          <div className="sheet-meta">
            <div className="sheet-price serif-text">
              {typeof product.price === 'number'
                ? `${product.startingFrom ? STORE_CONFIG.copy.ui.startingFromPrefix : ''}${product.price.toLocaleString()} ${product.currency || STORE_CONFIG.copy.ui.pricePrefix}`
                : STORE_CONFIG.copy.ui.priceOnRequest}
            </div>
            <div className="sheet-specs">
              <span>{product.specs}</span>
              {product.leadTime && (
                <>
                  <span className="sheet-dot">•</span>
                  <span>{STORE_CONFIG.copy.ui.leadTimeLabel}: {product.leadTime}</span>
                </>
              )}
            </div>
          </div>

          {hasGallery && (
            <div className="sheet-desc">
              <button type="button" className="sheet-gallery" onClick={handleOpenGallery}>
                <span className="sheet-gallery-icon"><ImageIcon /></span>
                <span>{STORE_CONFIG.copy.ui.viewPhotosLabel} ({imagesCount})</span>
              </button>
            </div>
          )}
        </div>

        <div className="sheet-cta">
          <button
            type="button"
            className={`btn btn-full ${product.isSoldOut ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handlePrimary}
            disabled={product.isSoldOut}
            style={{ opacity: product.isSoldOut ? 0.7 : 1, cursor: product.isSoldOut ? 'not-allowed' : 'pointer' }}
          >
            {!product.isSoldOut && (primary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />)}
            <span>{product.isSoldOut ? STORE_CONFIG.copy.ui.unavailableNow : (primary === 'whatsapp' ? STORE_CONFIG.copy.ui.orderViaWhatsApp : STORE_CONFIG.copy.ui.orderViaMessenger)}</span>
          </button>

          {!product.isSoldOut && (
            <button
              type="button"
              className="btn btn-full btn-secondary"
              onClick={handleSecondary}
              style={{ marginTop: '10px' }}
            >
              {secondary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
              <span>{secondary === 'whatsapp' ? STORE_CONFIG.copy.ui.altWhatsApp : STORE_CONFIG.copy.ui.altMessenger}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSheet;
