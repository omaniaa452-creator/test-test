/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

/**
 * Bridal / fashion "style" card.
 *
 * NOTE: This template is meant for a static, WhatsApp-only conversion flow.
 * Keep fields minimal and product-to-sale oriented.
 */
export interface Product {
  id: string;
  name: string;

  /** Thumbnail (should be the first image) */
  image: string;
  /** Gallery images (lazy-loaded inside modal; do NOT preload all) */
  images?: string[];

  /** Optional pricing. If omitted, show "حسب الطلب". */
  price?: number;
  currency?: string;
  /** If true, display "ابتداءً من". */
  startingFrom?: boolean;

  /** Optional: stock flag. If omitted, assumed in stock. */
  inStock?: boolean;

  /** e.g. "تفصيل حسب الطلب" / "جاهز" */
  availabilityLabel?: string;
  /** Quick trust badges, max 2–3 */
  badges: string[];
  /** One-line description: fabric / style / details */
  specs: string;
  /** Lead time e.g. "10–21 يوم" */
  leadTime?: string;
  /** Category for analytics / filtering (optional) */
  category?: 'زفاف' | 'خطوبة' | 'تراثي' | 'سوارية' | 'أخرى';

  isSoldOut?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TrustSignal {
  icon: React.ReactNode;
  text: string;
}


export interface VideoItem {
  id: string;
  title: string;
  /** Poster image URL */
  poster: string;
  /** MP4 source URL (may be missing in demo) */
  src: string;
}

export interface Artifact {
  id: string;
  styleName: string;
  html: string;
  status: string;
}
