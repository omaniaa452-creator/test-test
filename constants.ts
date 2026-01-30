/**
 * Backward-compatible constants exports.
 * Data lives in /data for buyers to edit.
 */
export const CONTACT_PHONE = (import.meta as any).env?.VITE_WHATSAPP_PHONE || '';
export { PRODUCTS, FAQS, VIDEOS } from './data/catalog';
