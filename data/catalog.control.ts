/**
 * Catalog visibility + ordering controls (V10.2).
 * Pure helpers to keep index.tsx clean and stable.
 */
import type { Product } from '../types';
import type { CatalogControl, CatalogSortingMode } from './store.config';

function uniqStrings(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const v of values) {
    const key = String(v || '').trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function getPriceValue(p: Product): number | null {
  const n = typeof (p as any).price === 'number' ? (p as any).price : undefined;
  if (typeof n !== 'number') return null;
  if (!Number.isFinite(n)) return null;
  // Treat 0 or negative as "on request" for sorting purposes
  if (n <= 0) return null;
  return n;
}

function isInStock(p: Product): boolean {
  // Optional field; if missing, assume in stock
  // Support both schemas:
  // - inStock === false
  // - isSoldOut === true (CSV import)
  if ((p as any).isSoldOut === true) return false;
  return (p as any).inStock !== false;
}

function buildRankMap(ids: string[]): Map<string, number> {
  const m = new Map<string, number>();
  uniqStrings(ids).forEach((id, idx) => m.set(id, idx));
  return m;
}

export function getVisibleProducts(all: Product[], control: CatalogControl): Product[] {
  const hidden = new Set(uniqStrings(control.hiddenIds));
  const hideOutOfStock = !!control.rules.hideOutOfStock;

  const out: Product[] = [];
  for (const p of all) {
    if (!p || !p.id) continue;
    if (hidden.has(p.id)) continue;
    if (hideOutOfStock && !isInStock(p)) continue;
    out.push(p);
  }
  return out;
}

export function getFeaturedProducts(visible: Product[], control: CatalogControl): Product[] {
  if (!control.featured.enabled) return [];
  const ids = uniqStrings(control.featured.ids);
  if (ids.length === 0) return [];

  const byId = new Map<string, Product>();
  for (const p of visible) byId.set(p.id, p);

  const out: Product[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(p);
    const lim = control.featured.limit;
    if (lim !== 'all' && out.length >= Math.max(0, lim)) break;
  }
  return out;
}

export function sortProducts(visible: Product[], control: CatalogControl): Product[] {
  const mode: CatalogSortingMode = control.sorting.mode;
  const tieBreaker = control.sorting.tieBreaker;

  const featuredRank = buildRankMap(control.featured.ids);
  const manualRank = buildRankMap(control.manualOrderIds);

  const decorated = visible.map((p, idx) => {
    const featured = featuredRank.has(p.id) ? featuredRank.get(p.id)! : Number.POSITIVE_INFINITY;
    const manual = manualRank.has(p.id) ? manualRank.get(p.id)! : Number.POSITIVE_INFINITY;
    const stock = isInStock(p) ? 0 : 1; // lower first
    const priceVal = getPriceValue(p);
    const hasPrice = priceVal !== null ? 0 : 1; // lower first
    return { p, idx, featured, manual, stock, priceVal: priceVal ?? 0, hasPrice };
  });

  const cmpManualThenDefault = (a: any, b: any) => {
    if (a.manual !== b.manual) return a.manual - b.manual;
    return a.idx - b.idx;
  };
  const cmpDefaultOnly = (a: any, b: any) => a.idx - b.idx;

  const tie = tieBreaker === 'manualThenDefault' ? cmpManualThenDefault : cmpDefaultOnly;

  decorated.sort((a, b) => {
    switch (mode) {
      case 'default':
        return a.idx - b.idx;

      case 'manual':
        if (a.manual !== b.manual) return a.manual - b.manual;
        return a.idx - b.idx;

      case 'featuredFirst': {
        if (a.featured !== b.featured) return a.featured - b.featured;
        return tie(a, b);
      }

      case 'inStockFirst': {
        if (a.stock !== b.stock) return a.stock - b.stock;
        return tie(a, b);
      }

      case 'priceAsc': {
        if (control.rules.treatMissingPriceAs === 'bottom') {
          if (a.hasPrice !== b.hasPrice) return a.hasPrice - b.hasPrice;
        }
        if (a.priceVal !== b.priceVal) return a.priceVal - b.priceVal;
        return tie(a, b);
      }

      case 'priceDesc': {
        if (control.rules.treatMissingPriceAs === 'bottom') {
          if (a.hasPrice !== b.hasPrice) return a.hasPrice - b.hasPrice;
        }
        if (a.priceVal !== b.priceVal) return b.priceVal - a.priceVal;
        return tie(a, b);
      }

      default:
        return a.idx - b.idx;
    }
  });

  const out: Product[] = [];
  const seen = new Set<string>();
  for (const d of decorated) {
    if (!d.p?.id) continue;
    if (seen.has(d.p.id)) continue;
    seen.add(d.p.id);
    out.push(d.p);
  }
  return out;
}

export function buildCatalogView(
  all: Product[],
  control: CatalogControl,
  homepageLimit: number | 'all'
): { featured: Product[]; main: Product[] } {
  const visible = getVisibleProducts(all, control);
  const featured = getFeaturedProducts(visible, control);
  const featuredSet = new Set(featured.map(p => p.id));

  const sorted = sortProducts(visible, control);

  const mainBase = (control.featured.enabled && featured.length > 0)
    ? sorted.filter(p => !featuredSet.has(p.id))
    : sorted;

  const lim = homepageLimit === 'all' ? 'all' : Math.max(0, homepageLimit);
  const main = lim === 'all' ? mainBase : mainBase.slice(0, lim);

  return { featured, main };
}
