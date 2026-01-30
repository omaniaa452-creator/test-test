/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton" aria-hidden="true">
      <div className="product-image-container skeleton-box" />
      <div className="product-details">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-meta" />
        <div className="skeleton-line skeleton-meta" />
        <div className="skeleton-line skeleton-price" />
        <div className="product-actions">
          <div className="skeleton-btn" />
          <div className="skeleton-btn skeleton-btn-secondary" />
        </div>
      </div>
    </div>
  );
}
