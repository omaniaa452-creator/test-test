import { Product } from './types';
import { STORE_CONFIG, OrderChannel } from './data/store.config';
import { trackEvent } from './utils';

type Density = 'compact' | 'normal' | 'airy';

function densityVars(d: Density) {
  switch (d) {
    case 'compact':
      return { cardPad: 10, titleSize: 15, metaSize: 12, ctaHeight: 42 };
    case 'airy':
      return { cardPad: 14, titleSize: 17, metaSize: 14, ctaHeight: 46 };
    default:
      return { cardPad: 12, titleSize: 16, metaSize: 13, ctaHeight: 44 };
  }
}

function aspectPadding(aspect: '1/1' | '4/5' | '3/4' | '16/9') {
  // Returns percentage string for padding-bottom fallback layout.
  switch (aspect) {
    case '1/1': return '100%';
    case '4/5': return '125%';
    case '3/4': return '133.33%';
    case '16/9': return '56.25%';
    default: return '125%';
  }
}

function setPxVar(root: HTMLElement, name: string, value: number) {
  root.style.setProperty(name, `${Math.round(value)}px`);
}

/**
 * Apply layout + grid controls from STORE_CONFIG.layout (V10.1).
 * - Sets CSS variables for container, grid cols/gaps, card density and image aspect.
 * - Updates --grid-cols/--grid-gap on resize using configured breakpoints.
 */
export function applyLayoutFromConfig() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const l = STORE_CONFIG.layout;
  const root = document.documentElement;

  // Static vars
  setPxVar(root, '--container-max', l.container.maxWidth);
  setPxVar(root, '--container-pad', l.container.paddingX);

  // Guardrails (V11.5)
  const ui = (STORE_CONFIG as any)?.copy?.ui;
  if (ui) {
    root.style.setProperty('--title-clamp', String(ui.maxTitleLines ?? 2));
    root.style.setProperty('--desc-clamp', String(ui.maxDescriptionLines ?? 6));
  }

  root.style.setProperty('--grid-cols-mobile', String(l.catalog.cols.mobile));
  root.style.setProperty('--grid-cols-tablet', String(l.catalog.cols.tablet));
  root.style.setProperty('--grid-cols-desktop', String(l.catalog.cols.desktop));

  setPxVar(root, '--grid-gap-mobile', l.catalog.gap.mobile);
  setPxVar(root, '--grid-gap-tablet', l.catalog.gap.tablet);
  setPxVar(root, '--grid-gap-desktop', l.catalog.gap.desktop);

  // Card vars
  setPxVar(root, '--card-radius', l.card.radius);
  root.style.setProperty('--card-shadow', l.card.shadow === 'none' ? 'none' : 'var(--shadow-soft)');

  const dv = densityVars(l.card.density);
  setPxVar(root, '--card-pad', dv.cardPad);
  setPxVar(root, '--title-size', dv.titleSize);
  setPxVar(root, '--meta-size', dv.metaSize);
  setPxVar(root, '--cta-height', dv.ctaHeight);

  root.style.setProperty('--img-pad', aspectPadding(l.card.image.aspect));
  root.style.setProperty('--img-fit', l.card.image.fit);

  // Catalog mode
  root.dataset.catalogLayout = l.catalog.layoutMode;
  root.dataset.density = l.card.density;

  const updateGrid = () => {
    const w = window.innerWidth || 0;
    const isDesktop = w >= l.breakpoints.desktopMin;
    const isTablet = w >= l.breakpoints.tabletMin && w < l.breakpoints.desktopMin;

	    // Widen type: cols vary per breakpoint (1..4).
	    let cols: number = l.catalog.cols.mobile;
	    let gap: number = l.catalog.gap.mobile;

    if (isDesktop) {
      cols = l.catalog.cols.desktop;
      gap = l.catalog.gap.desktop;
    } else if (isTablet) {
      cols = l.catalog.cols.tablet;
      gap = l.catalog.gap.tablet;
    }

    // If list mode, force 1 column on small screens.
	    if (l.catalog.layoutMode === 'list' && !isDesktop) {
	      cols = 1;
	    }

    root.style.setProperty('--grid-cols', String(cols));
    setPxVar(root, '--grid-gap', gap);
  };

  const anyWin = window as any;
  if (!anyWin.__maisonAuraLayoutBound) {
    anyWin.__maisonAuraLayoutBound = true;
    window.addEventListener('resize', updateGrid, { passive: true });
  }
  updateGrid();
}

export function applyThemeFromConfig() {
  if (typeof document === 'undefined') return;
  const t = STORE_CONFIG.theme;
  const root = document.documentElement;
  root.style.setProperty('--bg-primary', t.bgPrimary);
  root.style.setProperty('--bg-secondary', t.bgSecondary);
  root.style.setProperty('--bg-card', t.bgCard);
  root.style.setProperty('--text-primary', t.textPrimary);
  root.style.setProperty('--text-secondary', t.textSecondary);
  root.style.setProperty('--accent-gold', t.accentGold);
  root.style.setProperty('--accent-gold-dim', t.accentGoldDim);
  root.dir = STORE_CONFIG.direction;
  root.lang = STORE_CONFIG.locale;
}

export function getPrimaryChannel(): OrderChannel {
  return STORE_CONFIG.preferredChannel;
}

export function getSecondaryChannel(): OrderChannel {
  return STORE_CONFIG.preferredChannel === 'whatsapp' ? 'messenger' : 'whatsapp';
}

function openWhatsApp(message: string) {
  const phone = STORE_CONFIG.whatsappPhone;
  if (!phone) {
    alert(STORE_CONFIG.copy.ui.envMissingWhatsApp);
    return;
  }
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
}

async function openMessenger(message: string) {
  const page = STORE_CONFIG.messengerPage;
  if (!page) {
    alert(STORE_CONFIG.copy.ui.envMissingMessenger);
    return;
  }
  // Messenger does not support prefilled text reliably for all clients.
  // We'll open the page and keep the message copied to clipboard (best-effort).
  let copied = false;
  try {
    await navigator.clipboard.writeText(message);
    copied = true;
  } catch {
    // ignore
  }
  try {
    if (copied) {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: STORE_CONFIG.copy.ui.toastMessengerCopied } }));
    } else {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: STORE_CONFIG.copy.ui.toastMessengerManual } }));
    }
  } catch {}
  window.open(`https://m.me/${encodeURIComponent(page)}`, '_blank', 'noopener,noreferrer');
}


export function contactGeneral(message: string, channel?: OrderChannel) {
  const ch = channel ?? STORE_CONFIG.preferredChannel;
  if (ch === 'messenger') { void openMessenger(message); return; }
  return openWhatsApp(message);
}

export function contactForProduct(product: Product, channel?: OrderChannel) {
  const code = `${STORE_CONFIG.productCodePrefix}-${String(product.id).padStart(3, '0')}`;
  const msg = STORE_CONFIG.messages.productLead({
    productName: product.name,
    productCode: code,
    category: product.category,
  });

  trackEvent('Contact', {
    content_id: code,
    content_name: product.name,
    content_category: product.category || 'Store',
    value: product.price ?? 0,
    currency: product.currency || 'TND',
    channel: channel ?? STORE_CONFIG.preferredChannel,
  });

  const ch = channel ?? STORE_CONFIG.preferredChannel;
  if (ch === 'messenger') { void openMessenger(msg); return; }
  return openWhatsApp(msg);
}

export function contactConcierge(args: { model: string; budget: string; notes: string }, channel?: OrderChannel) {
  const msg = STORE_CONFIG.messages.conciergeLead(args);

  trackEvent('Concierge_Request', { model: args.model, channel: channel ?? STORE_CONFIG.preferredChannel });

  const ch = channel ?? STORE_CONFIG.preferredChannel;
  if (ch === 'messenger') { void openMessenger(msg); return; }
  return openWhatsApp(msg);
}
