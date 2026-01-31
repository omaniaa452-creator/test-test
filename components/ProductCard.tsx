/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';
import { WhatsappIcon, MessengerIcon } from './Icons';
import { contactForProduct, getPrimaryChannel, getSecondaryChannel } from '../order';
import { STORE_CONFIG } from '../data/store.config';

interface ProductCardProps {
    product: Product;
    onOpenProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenProduct }) => {
    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState<string>(product.image || STORE_CONFIG.copy.ui.placeholderProductImage);
    const code = `${STORE_CONFIG.productCodePrefix}-${String(product.id).padStart(3, '0')}`;
        React.useEffect(() => {
        setImgLoaded(false);
        setImgSrc(product.image || STORE_CONFIG.copy.ui.placeholderProductImage);
    }, [product.image]);

const isPlaceholderImage = typeof product.image === 'string' && product.image.includes('unsplash.com');
    
    const primary = getPrimaryChannel();
    const secondary = getSecondaryChannel();

    const handleOpen = () => {
        onOpenProduct(product);
        trackEventSafe('ViewContent', { type: 'product_sheet', content_name: product.name });
    };

    const handlePrimaryContact = () => {
        if (product.isSoldOut) return;
        contactForProduct(product, primary);
    };

    const handleSecondaryContact = () => {
        if (product.isSoldOut) return;
        contactForProduct(product, secondary);
    };

    // Avoid a hard dependency on utils.ts (keeps ProductCard portable)
    const trackEventSafe = (name: string, params: any) => {
        try {
            (window as any)?.fbq && (window as any).fbq('track', name, params);
        } catch { /* no-op */ }
    };


    return (
        <div className={`product-card ${product.isSoldOut ? 'sold-out' : ''}`}>
            <div
                className={`product-image-container${imgLoaded ? " is-loaded" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={STORE_CONFIG.copy.ui.ariaOpenProduct}
                onClick={handleOpen}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleOpen();
                }}
            >
                <img 
                    src={imgSrc} 
                    alt={product.name} 
                    className="product-image"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => {
                        setImgLoaded(true);
                        if (imgSrc !== STORE_CONFIG.copy.ui.placeholderProductImage) {
                            setImgSrc(STORE_CONFIG.copy.ui.placeholderProductImage);
                        }
                    }}
                    loading="lazy" 
                    decoding="async"
                />
                
                {product.isSoldOut && (
                    <div className="sold-out-overlay">
                        <span>{STORE_CONFIG.copy.ui.soldOutOverlay}</span>
                    </div>
                )}

                {!product.isSoldOut && product.badges.length > 0 && (
                    <div className="product-badges">
                        {product.badges.slice(0, STORE_CONFIG.copy.ui.badgesClamp).map((badge, index) => (
                            <span key={index} className="badge">{badge}</span>
                        ))}
                        {isPlaceholderImage && (
                            <span className="badge" style={{opacity: 0.85}}>{STORE_CONFIG.copy.ui.placeholderImageBadge}</span>
                        )}
                    </div>
                )}

                {!product.isSoldOut && product.badges.length === 0 && isPlaceholderImage && (
                    <div className="product-badges">
                        <span className="badge" style={{opacity: 0.85}}>{STORE_CONFIG.copy.ui.placeholderImageBadge}</span>
                    </div>
                )}
            </div>
            
            <div className="product-details" onClick={handleOpen}>
                <h3 className="product-title">{product.name}</h3>
                <div className="product-meta" style={{marginTop: '6px'}}>
                    <span style={{fontWeight: 700}}>{STORE_CONFIG.copy.ui.codeLabel}: {code}</span>
                </div>
                <div className="product-meta">
                    <span>{product.availabilityLabel || STORE_CONFIG.copy.ui.availabilityFallback}</span>
                    <span>•</span>
                    <span>{product.specs}</span>
                    {product.leadTime && (
                        <>
                            <span>•</span>
                            <span>{STORE_CONFIG.copy.ui.leadTimeLabel}: {product.leadTime}</span>
                        </>
                    )}
                </div>
                <div className="product-price serif-text">
                    {typeof product.price === 'number'
                        ? `${product.startingFrom ? STORE_CONFIG.copy.ui.startingFromPrefix : ''}${product.price.toLocaleString()} ${product.currency || STORE_CONFIG.copy.ui.pricePrefix}`
                        : STORE_CONFIG.copy.ui.priceOnRequest}
                </div>
                
                <div className="product-actions">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                        className={`btn btn-full ${product.isSoldOut ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ opacity: product.isSoldOut ? 0.7 : 1, cursor: 'pointer' }}
                    >
                        <span>{product.isSoldOut ? STORE_CONFIG.copy.ui.unavailableNow : STORE_CONFIG.copy.ui.viewDetails}</span>
                    </button>

                    {!product.isSoldOut && STORE_CONFIG.copy.ui.enableQuickOrderButtons && (
                        <div className="product-quick-order">
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePrimaryContact(); }}
                                className="btn btn-full btn-secondary"
                                style={{ marginTop: '10px' }}
                            >
                                {primary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
                                <span>{primary === 'whatsapp' ? STORE_CONFIG.copy.ui.orderViaWhatsApp : STORE_CONFIG.copy.ui.orderViaMessenger}</span>
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); handleSecondaryContact(); }}
                                className="btn btn-full btn-secondary"
                                style={{ marginTop: '10px' }}
                            >
                                {secondary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
                                <span>{secondary === 'whatsapp' ? STORE_CONFIG.copy.ui.altWhatsApp : STORE_CONFIG.copy.ui.altMessenger}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
