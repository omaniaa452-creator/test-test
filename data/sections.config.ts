/**
 * Sections ON/OFF + Navigation config
 * Keep this file small and easy for buyers to edit.
 */

export type SectionKey =
  | 'hero'
  | 'trustBar'
  | 'collection'
  | 'how'
  | 'videos'
  | 'testimonials'
  | 'whyUs'
  | 'faq';

/**
 * Section UI controls (V11.3)
 * Buyers can change spacing / width / background per section (no code changes).
 */
export type SectionVariant = 'default' | 'compact' | 'featured';
export type SectionSpacing = 'tight' | 'normal' | 'roomy';
export type SectionWidth = 'container' | 'full' | 'narrow';
export type SectionBg = 'none' | 'soft' | 'gradient';

export type SectionUi = {
  variant?: SectionVariant;
  spacing?: SectionSpacing;
  width?: SectionWidth;
  bg?: SectionBg;
};

export type AnchorId = 'collection' | 'how' | 'videos' | 'testimonials' | 'why-us' | 'faq';

export type NavItem = { id: AnchorId; label: string };

export const SECTIONS_ENABLED: Record<SectionKey, boolean> = {
  hero: true,
  trustBar: true,
  collection: true,
  how: true,
  // Closed by default. The Videos section will still auto-show if videos exist.
  videos: false,
  testimonials: true,
  whyUs: true,
  faq: true,
};

// Section render order. Buyers can reorder sections without touching React.
export const SECTION_ORDER: SectionKey[] = [
  'hero',
  'trustBar',
  'collection',
  'how',
  'videos',
  'testimonials',
  'whyUs',
  'faq',
];

/**
 * Per-section UI controls.
 * Defaults are chosen to match the current design.
 */
export const SECTION_UI: Record<SectionKey, SectionUi> = {
  hero: { variant: 'default', spacing: 'normal', width: 'container', bg: 'none' },
  trustBar: { variant: 'compact', spacing: 'tight', width: 'container', bg: 'none' },
  collection: { variant: 'default', spacing: 'normal', width: 'container', bg: 'none' },
  how: { variant: 'default', spacing: 'roomy', width: 'container', bg: 'none' },
  videos: { variant: 'default', spacing: 'roomy', width: 'container', bg: 'none' },
  testimonials: { variant: 'default', spacing: 'roomy', width: 'container', bg: 'none' },
  whyUs: { variant: 'featured', spacing: 'roomy', width: 'full', bg: 'soft' },
  faq: { variant: 'default', spacing: 'roomy', width: 'container', bg: 'none' },
};

export function getSectionUi(key: SectionKey): Required<SectionUi> {
  const ui = SECTION_UI[key] ?? {};
  return {
    variant: ui.variant ?? 'default',
    spacing: ui.spacing ?? 'normal',
    width: ui.width ?? 'container',
    bg: ui.bg ?? 'none',
  };
}

export function getSectionOrder(key: SectionKey): number {
  const idx = SECTION_ORDER.indexOf(key);
  return idx >= 0 ? idx : 999;
}

// Navigation items (shown only if the related section is enabled AND available).
export const NAV_ITEMS: NavItem[] = [
  { id: 'collection', label: 'التصاميم' },
  { id: 'how', label: 'كيف نشتغل' },
  { id: 'testimonials', label: 'آراء الزبائن' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
];

function isVideosAvailable(hasVideos: boolean): boolean {
  return !!hasVideos;
}

export function isSectionEnabled(key: SectionKey, hasVideos: boolean): boolean {
  if (key === 'videos') {
    // Auto-show when videos exist, regardless of default toggle.
    return isVideosAvailable(hasVideos);
  }
  return !!SECTIONS_ENABLED[key];
}

export function getEnabledNavItems(hasVideos: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    if (item.id === 'videos') return isSectionEnabled('videos', hasVideos);
    if (item.id === 'why-us') return isSectionEnabled('whyUs', hasVideos);
    // ids match section keys except why-us mapping
    return isSectionEnabled(item.id as SectionKey, hasVideos);
  });
}

export function getPrimaryScrollTarget(hasVideos: boolean): AnchorId {
  // Prefer first enabled anchor in NAV.
  const enabled = getEnabledNavItems(hasVideos);
  return (enabled[0]?.id ?? 'collection') as AnchorId;
}
