/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import ProductCard from './components/ProductCard';
import ProductCardSkeleton from './components/ProductCardSkeleton';
import GalleryModal from './components/GalleryModal';
import ProductSheet from './components/ProductSheet';
import VideoModal from './components/VideoModal';
import Testimonials from './components/Testimonials';
import SideDrawer from './components/SideDrawer';
import { CheckShieldIcon, SparklesIcon, ChevronDownIcon, ArrowUpIcon, PlayIcon, MenuIcon, CloseIcon } from './components/Icons';
import { PRODUCTS as INITIAL_PRODUCTS, FAQS, VIDEOS } from './constants';
import { Product } from './types';
import { parseProductsCSV, trackEvent, checkForBuildUpdate } from './utils';
import { STORE_CONFIG } from './data/store.config';
import { buildCatalogView } from './data/catalog.control';
import { applyThemeFromConfig, applyLayoutFromConfig, contactGeneral } from './order';
import { SECTIONS_ENABLED, getEnabledNavItems, getPrimaryScrollTarget, getSectionOrder, getSectionUi } from './data/sections.config';

// CHANGE THIS URL TO YOUR OWN PUBLISHED GOOGLE SHEET CSV URL
// See README.md for instructions
// Example: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"
// Leave empty ("") to use local data from constants.ts
const GOOGLE_SHEET_CSV_URL: string = ""; 

function App() {
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastVisible, setToastVisible] = useState<boolean>(false);

    // Videos are optional and can be partially filled.
    // Only render valid entries to avoid broken cards when some items are placeholders.
    const activeVideos = React.useMemo(
        () => (Array.isArray(VIDEOS) ? VIDEOS.filter(v => (v?.src || '').trim().length > 0) : []),
        []
    );
    const hasVideos = activeVideos.length > 0;
    const enabledNav = getEnabledNavItems(hasVideos);
    const primaryScrollTarget = getPrimaryScrollTarget(hasVideos);
    const navCfg = STORE_CONFIG.nav;
    const menuCfg = STORE_CONFIG.catalogMenus;

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeMenuId, setActiveMenuId] = useState<string>(() => {
    if (!menuCfg?.enabled) return 'all';

    // Category pages mode: read selected catalog menu from URL query (default: ?cat=...)
    const paramName = String((menuCfg as any).paramName || 'cat').trim() || 'cat';

    const items = Array.isArray(menuCfg.items) ? menuCfg.items : [];
    const ids = items
      .map(i => String((i as any)?.id || '').trim())
      .filter(Boolean);

    const allowed = new Map<string, string>();
    for (const id of ids) allowed.set(id.toLowerCase(), id);
    if (menuCfg.showAll ?? true) allowed.set('all', 'all');

    try {
      const qs = new URLSearchParams(window.location.search);
      const raw = qs.get(paramName);
      const cat = String(raw || '').trim();
      if (cat) {
        const resolved = allowed.get(cat.toLowerCase());
        if (resolved) return resolved;
        // Unknown category -> fall back safely
        return (menuCfg.showAll ?? true) ? 'all' : (ids[0] || 'all');
      }
    } catch {
      // ignore
    }

    // Fallback to config defaults
    const def = String(menuCfg.defaultId || '').trim();
    if (def) return def;
    return (menuCfg.showAll ?? true) ? 'all' : (ids[0] || 'all');
  });
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // V11: Product bottom sheet modal
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>(() => enabledNav[0]?.id ?? '');
  const activeSectionIdRef = useRef<string>(enabledNav[0]?.id ?? '');
  useEffect(() => { activeSectionIdRef.current = activeSectionId; }, [activeSectionId]);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [showQuickCta, setShowQuickCta] = useState(false);

// V11.6: Optional catalog menus (tabs) to split products into lists
const catalogMenuItems = React.useMemo(() => {
  if (!menuCfg?.enabled) return [];
  const items = Array.isArray(menuCfg.items) ? menuCfg.items : [];
  const normalized = items
    .filter(i => (i?.id || '').trim().length > 0 && (i?.label || '').trim().length > 0)
    .map(i => ({
      id: String(i.id),
      label: String(i.label),
      categories: Array.isArray(i.categories) ? i.categories.map(String) : undefined,
      productIds: Array.isArray(i.productIds) ? i.productIds.map(String) : undefined,
    }));
  const withAll = (menuCfg.showAll ?? true)
    ? [{ id: 'all', label: String(menuCfg.allLabel || 'All') }, ...normalized]
    : normalized;
  return withAll;
}, [menuCfg]);

// Category pages: sanitize invalid ?cat= and keep document title in sync
useEffect(() => {
  if (!menuCfg?.enabled) return;
  const paramName = String((menuCfg as any).paramName || 'cat').trim() || 'cat';
  const qs = new URLSearchParams(window.location.search);
  const raw = qs.get(paramName);
  if (raw === null) return;
  // If param is present but empty, remove it to keep URLs clean
  if (String(raw).trim() === '') {
    qs.delete(paramName);
    const newSearch = qs.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
    window.history.replaceState(null, '', newUrl);
    return;
  }

  const key = raw.trim().toLowerCase();
  const allowed = new Set(catalogMenuItems.map(i => String(i.id).trim().toLowerCase()));
  if (!allowed.has(key)) {
    qs.delete(paramName);
    const newSearch = qs.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') ;
    window.history.replaceState(null, '', newUrl);
  }
}, [menuCfg, catalogMenuItems]);

useEffect(() => {
  const baseTitle = String(STORE_CONFIG.brandName || 'Store');
  if (!menuCfg?.enabled) {
    document.title = baseTitle;
    return;
  }
  const item = catalogMenuItems.find(i => i.id === activeMenuId);
  const label = item?.label ? String(item.label).trim() : '';
  if (label && String(activeMenuId) !== 'all') {
    document.title = `${label} | ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
}, [activeMenuId, catalogMenuItems, menuCfg]);

const handleCatalogMenuSelect = (id: string) => {
  if (!menuCfg?.enabled) return;
  const next = String(id || '').trim();
  if (!next) return;

  const current = String(activeMenuId || '').trim();
  if (current === next) return;

  const mode = String((menuCfg as any).navigationMode || 'filter').trim();
  if (mode === 'reload') {
    const paramName = String((menuCfg as any).paramName || 'cat').trim() || 'cat';
    const url = new URL(window.location.href);

    if (next === 'all') url.searchParams.delete(paramName);
    else url.searchParams.set(paramName, next);

    // Avoid any in-page hash scrolling; we want a true section page feel.
    url.hash = '';

    // Force a real navigation (reload)
    window.location.assign(url.toString());
    return;
  }

  // Default behavior: filter in-place without page reload
  setActiveMenuId(next);
};


// Ensure active menu id is valid when catalog menus are enabled
useEffect(() => {
  if (!menuCfg?.enabled) return;
  const ids = new Set(catalogMenuItems.map(i => i.id));
  if (ids.size === 0) return;
  const current = (activeMenuId || '').trim();
  if (current && ids.has(current)) return;
  const fallback = (menuCfg.showAll ?? true) ? 'all' : (catalogMenuItems[0]?.id ?? 'all');
  setActiveMenuId(fallback);
}, [menuCfg, catalogMenuItems]);

const filteredProducts = React.useMemo(() => {
  if (!menuCfg?.enabled) return products;
  const key = (activeMenuId || '').trim();
  if (!key || key === 'all') return products;

  const item = catalogMenuItems.find(i => i.id === key);
  if (!item) return products;

  // Filter by explicit product IDs first (if provided)
  if (Array.isArray((item as any).productIds) && (item as any).productIds.length > 0) {
    const set = new Set(((item as any).productIds as string[]).map(v => String(v).trim()).filter(Boolean));
    return products.filter(p => set.has(p.id));
  }

  // Otherwise filter by categories (uses Product.category)
  const cats = (item as any).categories as string[] | undefined;
  if (Array.isArray(cats) && cats.length > 0) {
    const norm = (v: unknown) => String(v ?? '').trim().toLowerCase();
    const set = new Set(cats.map(norm).filter(Boolean));
    return products.filter(p => {
      const c = norm((p as any).category);
      return c && set.has(c);
    });
  }

  return products;
}, [menuCfg, products, activeMenuId, catalogMenuItems]);

// V10.2 Catalog controls (visibility + featured + sorting)
const homepageLimit = STORE_CONFIG.layout.catalog.homepageProductLimit;
const catalogView = React.useMemo(
  () => buildCatalogView(filteredProducts, STORE_CONFIG.catalogControl, homepageLimit),
  [filteredProducts, homepageLimit]
);
const featuredProducts = catalogView.featured;
const visibleProducts = catalogView.main;



  const [galleryTitle, setGalleryTitle] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState<number>(0);

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoPoster, setVideoPoster] = useState<string>('');
  const [videoSrc, setVideoSrc] = useState<string>('');

  useEffect(() => {
        applyThemeFromConfig();
    applyLayoutFromConfig();
        // V10.3: refresh feel (auto-reload once when a new deployment is detected)
        checkForBuildUpdate({ toastMessage: STORE_CONFIG.copy.ui.toastBuildUpdated });
// Track PageView is already handled by the Facebook Pixel snippet in index.html.
    // Avoid double-counting by not firing a second PageView event here.

    // 2. Fetch Data from Google Sheets (Only if configured)
    if (GOOGLE_SHEET_CSV_URL && GOOGLE_SHEET_CSV_URL.startsWith('http')) {
        setLoading(true);
        fetch(GOOGLE_SHEET_CSV_URL)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(csvText => {
                try {
                    const sheetProducts = parseProductsCSV(csvText);
                    if (sheetProducts.length > 0) {
                        setProducts(sheetProducts);
                    }
                } catch (e) {
                    console.error("Failed to parse CSV", e);
                }
            })
            .catch(err => {
                console.warn("Could not fetch Google Sheet data. Using local backup.", err);
            })
            .finally(() => setLoading(false));
    }
  }, []);

    useEffect(() => {
        const onToast = (e: any) => {
            const msg = String(e?.detail?.message ?? '');
            if (!msg) return;
            setToastMessage(msg);
            setToastVisible(true);
            window.setTimeout(() => setToastVisible(false), 4500);
        };
        window.addEventListener('app:toast', onToast as any);

  return () => window.removeEventListener('app:toast', onToast as any);
    }, []);

  // Handle Scroll for Back-to-Top Button
  useEffect(() => {
      const checkScroll = () => {
          if (window.scrollY > 400) {
              setShowScrollTop(true);
          } else {
              setShowScrollTop(false);
          }
      };

      window.addEventListener('scroll', checkScroll);
      return () => window.removeEventListener('scroll', checkScroll);
  }, []);


// V11.4/V11.6: Header compact mode + active section highlight + quick CTA
useEffect(() => {
  if (!navCfg?.enabled) return;

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;

      const y = window.scrollY || 0;
      setIsHeaderCompact(y > 24);

      // Quick CTA appears after some scrolling (config-controlled)
      if (navCfg.quickCta) {
        setShowQuickCta(y > 650);
      } else {
        setShowQuickCta(false);
      }

      // Active section (for nav highlight)
      const headerEl = document.querySelector<HTMLElement>('.main-header');
      const headerH = headerEl?.offsetHeight ?? 0;
      const probeY = y + headerH + 120;

      let current = enabledNav[0]?.id ?? '';
      for (const item of enabledNav) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= probeY) current = item.id;
      }
      if (current && current !== activeSectionIdRef.current) {
        activeSectionIdRef.current = current;
        setActiveSectionId(current);
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => {
    window.removeEventListener('scroll', onScroll as any);
    if (raf) window.cancelAnimationFrame(raf);
  };
}, [navCfg, enabledNav]);

  const openGallery = (product: Product, startIndex = 0) => {
      setGalleryTitle(product.name);
      const placeholder = STORE_CONFIG.copy.ui.placeholderProductImage || '/assets/placeholder-product.svg';
      const raw = (product.images && product.images.length) ? product.images : [product.image];
      const cleaned = raw
        .map(v => String(v ?? '').trim())
        .filter(Boolean);
      const imgs = cleaned.length ? cleaned : [placeholder];
      const safeIndex = Math.max(0, Math.min(startIndex, imgs.length - 1));
      setGalleryImages(imgs);
      setGalleryStartIndex(safeIndex);
      setGalleryOpen(true);
      trackEvent('ViewContent', { type: 'gallery', content_name: product.name });
  };

  const openProduct = (product: Product) => {
      setActiveProduct(product);
      setProductSheetOpen(true);
  };

  const closeProduct = () => {
      setProductSheetOpen(false);
      // Keep the last product in state to avoid flicker on close animation (CSS only)
      window.setTimeout(() => setActiveProduct(null), 0);
  };

  const openVideo = (title: string, poster: string, src: string) => {
      setVideoTitle(title);
      setVideoPoster(poster);
      setVideoSrc(src);
      setVideoOpen(true);
  };


  const closeGallery = () => {
      setGalleryOpen(false);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(prev => prev === id ? null : id);
  };

  const scrollToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  };

  const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const headerEl = document.querySelector<HTMLElement>('.main-header');
      const headerH = headerEl?.offsetHeight ?? 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      setIsNavOpen(false);
  };

  // Note: WhatsApp ordering is product-specific (from ProductCard).
  // We avoid generic WhatsApp CTAs to keep messages always tied to a product code.

  const sectionClass = (key: keyof typeof SECTIONS_ENABLED, extra: string = ''): string => {
    const ui = getSectionUi(key as any);
    const base = `section-shell section-variant-${ui.variant} section-space-${ui.spacing} section-width-${ui.width} section-bg-${ui.bg}`;
    return `${base} ${extra}`.trim();
  };

  const EmptySection = ({ title, hint }: { title: string; hint: string }) => (
    <div className="empty-section">
      <p className="empty-section-title">{title}</p>
      <p className="empty-section-hint">{hint}</p>
    </div>
  );

  return (
    <div className="app-container">
        {/* Header */}
        <div className="top-bar">
            {STORE_CONFIG.copy.topBar}
        </div>
        {navCfg.enabled ? (
        <header className={`main-header ${isHeaderCompact ? 'is-compact' : ''}`}>

            <div className="container header-content">
                <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>{STORE_CONFIG.brandName}</a>

                {navCfg.enabled && navCfg.desktopLinks && (
                <nav className="nav-links" aria-label="Primary">
                    {enabledNav.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`nav-link ${activeSectionId === item.id ? 'is-active' : ''}`}
                          onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
              )}

                {navCfg.enabled && navCfg.hamburger && (
                <button
                  className="nav-toggle"
                  type="button"
                  aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isNavOpen}
                  onClick={() => setIsNavOpen((v) => !v)}
                >
                  {isNavOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              )}
            </div>
        </header>
        ) : null}

        {navCfg.enabled && navCfg.hamburger && (
        <SideDrawer
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          title={STORE_CONFIG.brandName}
        >
          <div className="drawer-nav">
            {enabledNav.map((item) => (
              <button
                key={item.id}
                className={`drawer-nav-link ${activeSectionId === item.id ? 'is-active' : ''}`}
                type="button"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </SideDrawer>
        )}

        <main role="main" className="main-stack">
            {/* Hero Section */}
            {SECTIONS_ENABLED.hero && (
            <section className={sectionClass('hero', 'hero-section container')} style={{ order: getSectionOrder('hero') }}>
                <span className="hero-tag">{STORE_CONFIG.copy.heroTag}</span>
                <h1 className="hero-title">{STORE_CONFIG.copy.heroTitle.split("\n").map((line, i) => (<React.Fragment key={i}>{line}{i < STORE_CONFIG.copy.heroTitle.split("\n").length - 1 ? <br /> : null}</React.Fragment>))}</h1>
                <p className="hero-subtitle">{STORE_CONFIG.copy.heroSubtitle}</p>
                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => scrollToSection(primaryScrollTarget)}>
                        <span>{STORE_CONFIG.copy.heroPrimaryButtonLabel}</span>
                    </button>
                </div>
                
                <div style={{marginTop: '48px', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)'}}>
                    <img 
                        src={STORE_CONFIG.copy.heroImageSrc} 
                        alt={STORE_CONFIG.copy.heroImageAlt} 
                        style={{width: '100%', height: 'auto', display: 'block'}}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </section>
            )}

            {/* Trust Bar */}
            {SECTIONS_ENABLED.trustBar && (
            <section className={sectionClass('trustBar', 'container')} style={{ order: getSectionOrder('trustBar') }}>
                <div className="trust-bar">
                    {(STORE_CONFIG.copy.trustBullets?.length ?? 0) === 0 ? (
                      <EmptySection title={STORE_CONFIG.copy.ui.emptySectionTitle} hint={STORE_CONFIG.copy.ui.emptySectionHint} />
                    ) : (
                      STORE_CONFIG.copy.trustBullets.map((t, i) => (
                          <div className="trust-item" style={{ cursor: 'default' }} key={i}>
                              <span className="trust-icon"><CheckShieldIcon /></span>
                              <span>{t}</span>
                          </div>
                      ))
                    )}
                </div>
            </section>
            )}

            {/* Product Grid */}
            {SECTIONS_ENABLED.collection && (
            <section id="collection" className={sectionClass('collection', 'container')} style={{ order: getSectionOrder('collection') }}>
                <div className="section-title">
                    <h2>{STORE_CONFIG.copy.sections.collectionTitle}</h2>
                    <p style={{color: 'var(--text-secondary)'}}>{STORE_CONFIG.copy.sections.collectionSubtitle}</p>


{menuCfg.enabled && catalogMenuItems.length > 0 && (
  <div className="catalog-menu" role="tablist" aria-label="Catalog menus">
    {catalogMenuItems.map((item) => (
      <button
        key={item.id}
        type="button"
        role="tab"
        aria-selected={activeMenuId === item.id}
        className={`catalog-menu-tab ${activeMenuId === item.id ? 'is-active' : ''}`}
        onClick={() => handleCatalogMenuSelect(item.id)}
      >
        {item.label}
      </button>
    ))}
  </div>
)}

                </div>
                
                {featuredProducts.length > 0 && (
<div className="featured-block">
    <div className="section-title featured-title">
        <h3>{STORE_CONFIG.catalogControl.featured.title}</h3>
    </div>
    <div className="product-grid">
        {featuredProducts.map(product => (
            <ProductCard
                key={product.id}
                product={product}
                onOpenProduct={openProduct}
            />
        ))}
    </div>
</div>
)}

{loading ? (
  <div className="product-grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <ProductCardSkeleton key={`skel-${i}`} />
    ))}
  </div>
) : (visibleProducts.length === 0 && featuredProducts.length === 0) ? (
  <div className="empty-catalog">
    <p className="empty-catalog-title">{STORE_CONFIG.copy.ui.emptyCatalogTitle}</p>
    <p className="empty-catalog-hint">{STORE_CONFIG.copy.ui.emptyCatalogHint}</p>
  </div>
) : (
  <div className="product-grid">
    {visibleProducts.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onOpenProduct={openProduct}
      />
    ))}
  </div>
)}
                
            </section>
            )}

            {/* How */}
            {SECTIONS_ENABLED.how && (
            <section id="how" className={sectionClass('how', 'container')} style={{ order: getSectionOrder('how') }}>
                    <div className="section-title">
                        <h2>{STORE_CONFIG.copy.sections.howTitle}</h2>
                        <p style={{color: 'var(--text-secondary)'}}>{STORE_CONFIG.copy.sections.howSubtitle}</p>
                    </div>

                    {(STORE_CONFIG.copy.sections.howSteps?.length ?? 0) === 0 ? (
                      <EmptySection title={STORE_CONFIG.copy.ui.emptySectionTitle} hint={STORE_CONFIG.copy.ui.emptySectionHint} />
                    ) : (
                      <div className="how-steps">
                          {STORE_CONFIG.copy.sections.howSteps.slice(0, 3).map((s, idx) => (
                              <div className="how-step" key={idx}>
                                  <div className="how-step-num">{idx + 1}</div>
                                  <div className="how-step-body">
                                      <div className="how-step-title">{s.title}</div>
                                      <div className="how-step-text">{s.text}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                    )}

                    <div style={{marginTop: '18px'}}>
                        <button className="btn btn-primary" onClick={() => {
                            contactGeneral(STORE_CONFIG.messages.generalLead());
                        }}>
                            {STORE_CONFIG.copy.sections.howCtaLabel}
                        </button>
                    </div>
            </section>
            )}

            {/* Videos (placeholders) */}
            {hasVideos && (
            <section id="videos" className={sectionClass('videos', 'container')} style={{ order: getSectionOrder('videos')}}>
                <div className="section-title">
                    <h2>{STORE_CONFIG.copy.sections.videosTitle}</h2>
                    <p style={{color: 'var(--text-secondary)'}}>{STORE_CONFIG.copy.sections.videosSubtitle}</p>
                </div>

                <div className="video-grid">
                    {activeVideos.map((v, idx) => (
                        <button
                            key={v.id}
                            type="button"
                            className="video-card video-card-btn"
                            onClick={() => openVideo(v.title, v.poster, v.src)}
                            aria-label={`تشغيل ${v.title}`}
                        >
                            <div className="video-thumb">
                                <img src={v.poster} alt="" loading="lazy" decoding="async" />
                                <span className="video-play" aria-hidden="true"><PlayIcon /></span>
                            </div>
                            <div className="video-caption">
                                <div className="video-title">{v.title}</div>
                                <div className="video-subtitle">{STORE_CONFIG.copy.sections.videoCardSubtitle}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
            )}

            {/* Testimonials - Added for Social Proof */}
            {SECTIONS_ENABLED.testimonials && (
                <Testimonials
                  order={getSectionOrder('testimonials')}
                  className={sectionClass('testimonials', 'container')}
                />
            )}

            {/* Why Us */}
            {SECTIONS_ENABLED.whyUs && (
            <section id="why-us" className={sectionClass('whyUs', 'why-us-section')} style={{ order: getSectionOrder('whyUs') }}>
                <div className="container">
                    <div className="section-title">
                        <h2>{STORE_CONFIG.copy.sections.whyUsTitle}</h2>
                        <p style={{color: 'var(--text-secondary)'}}>{STORE_CONFIG.copy.sections.whyUsSubtitle}</p>
                    </div>
                    {(STORE_CONFIG.copy.sections.whyUsItems?.length ?? 0) === 0 ? (
                      <EmptySection title={STORE_CONFIG.copy.ui.emptySectionTitle} hint={STORE_CONFIG.copy.ui.emptySectionHint} />
                    ) : (
                      <div className="features-grid">
                          {STORE_CONFIG.copy.sections.whyUsItems.slice(0, 3).map((it, idx) => (
                              <div className="feature-item" key={idx}>
                                  <div style={{fontSize: '2rem'}}>{it.emoji}</div>
                                  <h3>{it.title}</h3>
                                  <p>{it.text}</p>
                              </div>
                          ))}
                      </div>
                    )}
                </div>
            </section>
            )}

            {/* FAQ */}
            {SECTIONS_ENABLED.faq && (
            <section id="faq" className={sectionClass('faq', 'faq-section container')} style={{ order: getSectionOrder('faq') }}>
                <div className="section-title">
                    <h2>{STORE_CONFIG.copy.sections.faqTitle}</h2>
                    <p style={{color: 'var(--text-secondary)'}}>{STORE_CONFIG.copy.sections.faqSubtitle}</p>
                </div>
                {(FAQS?.length ?? 0) === 0 ? (
                  <EmptySection title={STORE_CONFIG.copy.ui.emptySectionTitle} hint={STORE_CONFIG.copy.ui.emptySectionHint} />
                ) : (
                <div className="accordion">
                    {FAQS.map((faq) => (
                        <div key={faq.id} className="accordion-item">
                            <button 
                                className={`accordion-header ${openFaq === faq.id ? 'active' : ''}`}
                                onClick={() => toggleFaq(faq.id)}
                                aria-expanded={openFaq === faq.id}
                                aria-controls={`faq-content-${faq.id}`}
                            >
                                <span>{faq.question}</span>
                                <span className="accordion-icon"><ChevronDownIcon /></span>
                            </button>
                            <div 
                                id={`faq-content-${faq.id}`}
                                className="accordion-body" 
                                style={{maxHeight: openFaq === faq.id ? '200px' : '0'}}
                            >
                                <div className="accordion-content">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </section>
            )}

            {/* Final CTA */}
            <section className="container" style={{textAlign: 'center', marginBottom: '80px'}}>
                <div style={{background: '#1a1a1a', color: '#fff', padding: '60px 24px', borderRadius: '12px'}}>
                    <h2 style={{marginBottom: '16px'}}>{STORE_CONFIG.copy.sections.finalCtaTitle}</h2>
                    <p style={{marginBottom: '32px', opacity: 0.9}}>{STORE_CONFIG.copy.sections.finalCtaSubtitle}</p>
                    <button className="btn btn-primary" onClick={() => {
                        contactGeneral(STORE_CONFIG.messages.generalLead());
                    }}>
                        <span>{STORE_CONFIG.copy.sections.finalCtaButtonLabel}</span>
                    </button>
                </div>
            </section>
        </main>
        {navCfg.enabled && navCfg.quickCta && showQuickCta && (
          <button
            className="quick-cta"
            type="button"
            onClick={() => contactGeneral(STORE_CONFIG.messages.generalLead())}
          >
            {STORE_CONFIG.copy.primaryCtaLabel}
          </button>
        )}


        {/* Sticky Mobile CTA */}
        <div className="sticky-cta">
            <button className="btn btn-primary btn-full" onClick={() => {
                contactGeneral(STORE_CONFIG.messages.generalLead());
            }}>
                <span>{STORE_CONFIG.copy.sections.stickyCtaLabel}</span>
            </button>
        </div>

        {/* Back to Top Button */}
        <button 
            className={`back-to-top ${showScrollTop ? 'visible' : ''}`} 
            onClick={scrollToTop}
            aria-label="العودة للأعلى"
        >
            <ArrowUpIcon />
        </button>
        
        {/* Product sheet (V11) */}
        <ProductSheet
            isOpen={productSheetOpen}
            product={activeProduct}
            onClose={closeProduct}
            onOpenGallery={(p, startIndex) => {
                // Close the product sheet first to avoid stacked modals.
                setProductSheetOpen(false);
                setGalleryTitle(p.name);
                setGalleryImages((p.images && p.images.length > 0) ? p.images : [p.image]);
                setGalleryStartIndex(startIndex ?? 0);
                setGalleryOpen(true);
            }}
        />

        {/* Gallery Modal (lazy images + back button closes) */}
        <GalleryModal
            isOpen={galleryOpen}
            title={galleryTitle}
            images={galleryImages}
            startIndex={galleryStartIndex}
            onClose={() => setGalleryOpen(false)}
        />

            <VideoModal
                isOpen={videoOpen}
                title={videoTitle}
                poster={videoPoster}
                src={videoSrc}
                onClose={() => setVideoOpen(false)}
            />


        {/* Toast */}
            <div className={`app-toast ${toastVisible ? 'show' : ''}`} role="status" aria-live="polite">
                {toastMessage}
            </div>

            {/* Footer */}
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <div className="brand-logo" style={{color: '#fff', marginBottom: '16px', fontSize: '1.5rem'}}>{STORE_CONFIG.brandName}</div>
                        <p style={{color: '#888', maxWidth: '320px'}}>
                            {STORE_CONFIG.tagline}
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>روابط سريعة</h4>
                        <ul className="footer-links">
                            {enabledNav.map((n) => (
                                <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>تواصل</h4>
                        <ul className="footer-links">
                            <li><a href={STORE_CONFIG.whatsappPhone ? `https://wa.me/${STORE_CONFIG.whatsappPhone}` : '#'} target={STORE_CONFIG.whatsappPhone ? "_blank" : undefined} rel={STORE_CONFIG.whatsappPhone ? "noopener noreferrer" : undefined}>واتساب</a></li>
                            <li><a href={STORE_CONFIG.messengerPage ? `https://m.me/${encodeURIComponent(STORE_CONFIG.messengerPage)}` : '#'} target={STORE_CONFIG.messengerPage ? "_blank" : undefined} rel={STORE_CONFIG.messengerPage ? "noopener noreferrer" : undefined}>ميسنجر</a></li>
                            <li style={{color: '#888'}}>{STORE_CONFIG.copy.instagramLabel}: {STORE_CONFIG.copy.instagramHandle}</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} {STORE_CONFIG.brandName}. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>

    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}