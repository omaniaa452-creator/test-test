/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { STORE_CONFIG } from '../data/store.config';

export default function Testimonials({ order, className }: { order?: number; className?: string }) {
  const title = STORE_CONFIG.copy.sections.testimonialsTitle;
  const subtitle = STORE_CONFIG.copy.sections.testimonialsSubtitle;
  const items = STORE_CONFIG.copy.sections.testimonialsItems;
  return (
    <section id="testimonials" className={className ?? 'container'} style={{ order: typeof order === 'number' ? order : undefined }}>
      <div className="section-title">
        <h2>{title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      </div>

      <div className="testimonials-grid">
        {(items ?? []).map((t, idx) => (
          <div key={idx} className="testimonial-card">
            <div className="testimonial-quote">“{t.quote}”</div>
            <div className="testimonial-author">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
