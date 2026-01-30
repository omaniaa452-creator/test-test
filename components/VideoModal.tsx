/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useMemo, useState } from 'react';
import { CloseIcon, PlayIcon, WhatsappIcon, MessengerIcon } from './Icons';
import { trackEvent } from '../utils';
import { contactGeneral, getPrimaryChannel, getSecondaryChannel } from '../order';
import { STORE_CONFIG } from '../data/store.config';

type Props = {
  isOpen: boolean;
  title?: string;
  poster?: string;
  src: string;
  onClose: () => void;
};

/**
 * VideoModal goals:
 * - Do NOT show a "broken player" UI if the MP4 is missing.
 * - Load video only on explicit user action (Click-to-play).
 * - If the file is missing, show a premium fallback + WhatsApp CTA.
 */
export default function VideoModal({ isOpen, title, poster, src, onClose }: Props) {
  const safeTitle = title || 'الفيديو';

  // empty until user clicks play
  const [activeSrc, setActiveSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  const primary = getPrimaryChannel();
  const secondary = getSecondaryChannel();

  const handlePrimaryContact = () => {
    const msg = `السلام عليكم، نحب فيديو العرض: ${safeTitle}.

هل يمكن إرساله؟`;
    contactGeneral(msg, primary);
  };

  const handleSecondaryContact = () => {
    const msg = `السلام عليكم، نحب فيديو العرض: ${safeTitle}.

هل يمكن إرساله؟`;
    contactGeneral(msg, secondary);
  };

  useEffect(() => {
    if (!isOpen) return;

    // history back-button close on mobile
    const onPop = () => onClose();
    window.history.pushState({ modal: 'video' }, '');
    window.addEventListener('popstate', onPop);

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    setActiveSrc('');
    setIsLoading(false);
    setLoadError(false);

    trackEvent('ViewContent', { type: 'video', content_name: safeTitle });

    return () => {
      window.removeEventListener('popstate', onPop);
      document.documentElement.style.overflow = prevOverflow;
      setActiveSrc('');
      setIsLoading(false);
      setLoadError(false);
    };
  }, [isOpen, onClose, safeTitle]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const startPlayback = () => {
    setLoadError(false);
    // If no video source is provided, keep the premium fallback and avoid a stuck loading state.
    if (!src || !src.trim()) {
      setIsLoading(false);
      setLoadError(true);
      return;
    }
    setIsLoading(true);
    setActiveSrc(src);
  };

  if (!isOpen) return null;

  const showFallback = !activeSrc || loadError;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card modal-video" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" title={safeTitle}>{safeTitle}</div>
          <button className="icon-btn" aria-label="إغلاق" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          {showFallback ? (
            <div className="video-fallback">
              <div className="video-fallback-icon" aria-hidden="true"><PlayIcon /></div>
              <div className="video-fallback-title">
                {loadError ? STORE_CONFIG.copy.ui.videoLoadErrorLabel : STORE_CONFIG.copy.ui.videoFullscreenLabel}
              </div>

              <div className="video-fallback-text">
                {loadError
                  ? 'قد يكون ملف الفيديو غير موجود. أضف ملفات MP4 داخل public/assets/videos بنفس الأسماء (video01.mp4…video04.mp4) وسيعمل التشغيل تلقائياً.'
                  : 'اضغط تشغيل وسيتم تحميل الفيديو عند الطلب فقط (بدون تحميل مسبق).'}
              </div>

              <div style={{display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap'}}>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={startPlayback}
                  disabled={isLoading || !src || !src.trim()}
                  aria-label="تشغيل الفيديو"
                >
                  {isLoading ? 'جار التحميل...' : 'تشغيل'}
                </button>

                </div>

              <div className="video-fallback-actions">
                <a
                  className="btn btn-secondary"
                  onClick={(e) => { e.preventDefault(); handlePrimaryContact(); }}
                  href="#"
                >
                  {primary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
                  <span>{primary === 'whatsapp' ? STORE_CONFIG.copy.ui.orderVideoViaWhatsApp : STORE_CONFIG.copy.ui.orderVideoViaMessenger}</span>
                </a>

                <a
                  className="btn btn-secondary"
                  style={{ marginTop: '10px' }}
                  onClick={(e) => { e.preventDefault(); handleSecondaryContact(); }}
                  href="#"
                >
                  {secondary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
                  <span>{secondary === 'whatsapp' ? STORE_CONFIG.copy.ui.altWhatsApp : STORE_CONFIG.copy.ui.altMessenger}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="video-stage" style={{ position: 'relative' }}>
              {/* Keep the player hidden until metadata loads to avoid "broken player" flash */}
              <video
                className="video-player"
                playsInline
                preload="metadata"
                poster={poster}
                controls={!isLoading}
                onLoadedMetadata={() => setIsLoading(false)}
                onCanPlay={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setLoadError(true);
                }}
                autoPlay
                style={{ opacity: isLoading ? 0 : 1 }}
              >
                <source src={activeSrc} type="video/mp4" />
              </video>

              {isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'rgba(0,0,0,0.35)',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  جار التحميل...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
