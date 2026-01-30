/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product } from './types';

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// Facebook Pixel Helper
export const trackEvent = (eventName: string, params?: object) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', eventName, params);
    }
};

// Simple CSV Parser for Google Sheets
export const parseProductsCSV = (csvText: string): Product[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, index) => {
        // Handle quotes in CSV (basic implementation)
        const values: string[] = [];
        let inQuote = false;
        let currentValue = '';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim());

        // Expected Order (v1): id, name, price, currency, image, availabilityLabel, badges (pipe), specs, isSoldOut
        const rawPrice = (values[2] || '').trim();
        const price = rawPrice === '' ? undefined : Number.parseFloat(rawPrice);

        return {
            id: values[0] || `csv-${index}`,
            name: values[1] || 'Style',
            price: Number.isFinite(price as any) ? (price as number) : undefined,
            currency: (values[3] || 'TND').trim(),
            image: (values[4] || '').trim(),
            images: (values[4] ? [values[4].trim()] : []),
            availabilityLabel: (values[5] || '').trim(),
            badges: values[6] ? values[6].split('|').map(b => b.trim()).filter(Boolean) : [],
            specs: (values[7] || '').trim(),
            isSoldOut: values[8]?.toLowerCase() === 'true' || values[8] === '1'
        };
    });
};

/**
 * Best-effort "refresh feel": if the deployed build version changes, reload once automatically.
 * This reduces stale-cache surprises for non-technical buyers.
 */
export async function checkForBuildUpdate(options?: { storageKey?: string; toastMessage?: string; reloadDelayMs?: number }) {
    if (typeof window === 'undefined') return;
    const storageKey = options?.storageKey ?? 'maison_aura_build_version';
    const reloadDelayMs = options?.reloadDelayMs ?? 450;

    try {
        // Respect Vite's BASE_URL (e.g., './' for relative hosting, or '/subpath/' for GitHub Pages).
        const baseUrl = (import.meta as any)?.env?.BASE_URL ?? '/';
        const base = new URL(baseUrl, window.location.href);
        const url = new URL('build.json', base);
        const res = await fetch(`${url.toString()}?ts=${Date.now()}`, { cache: 'no-store' as RequestCache });
        if (!res.ok) return;
        const data: any = await res.json();
        const current = String(data?.version ?? '');
        if (!current) return;

        const prev = window.localStorage.getItem(storageKey);

        // First visit: store and continue.
        if (!prev) {
            window.localStorage.setItem(storageKey, current);
            return;
        }

        // If changed: store new version, notify, then reload once.
        if (prev !== current) {
            window.localStorage.setItem(storageKey, current);
            const msg = options?.toastMessage ?? 'تم تحديث الموقع… جارٍ إعادة التحميل';
            window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: msg } }));
            window.setTimeout(() => window.location.reload(), reloadDelayMs);
        }
    } catch {
        // ignore
    }
}
