/**
 * Central store configuration (edit this file only).
 * Supports WhatsApp + Messenger order flows and simple Presets.
 */
import { applyPreset, getPresetById } from './presets';

export type OrderChannel = 'whatsapp' | 'messenger';

export type CatalogSortingMode =
  | 'default'
  | 'manual'
  | 'featuredFirst'
  | 'inStockFirst'
  | 'priceAsc'
  | 'priceDesc';

export interface CatalogFeaturedConfig {
  enabled: boolean;
  /** Title displayed above the featured section (homepage). */
  title: string;
  /** Ordered list of product IDs to feature. */
  ids: string[];
  /** Max items to show in the featured section. */
  limit: number | 'all';
}

export interface CatalogSortingConfig {
  mode: CatalogSortingMode;
  tieBreaker: 'manualThenDefault' | 'defaultOnly';
}

export interface CatalogRulesConfig {
  /** If true, completely hide products marked as inStock=false. */
  hideOutOfStock: boolean;
  /** Sorting rule: how to treat missing/0 prices. */
  treatMissingPriceAs: 'bottom' | 'zero';
}

export interface CatalogControl {
  /** Product IDs to hide everywhere (ignored if missing). */
  hiddenIds: string[];
  featured: CatalogFeaturedConfig;
  sorting: CatalogSortingConfig;
  /** Manual ordering IDs used by sorting.mode=manual or as a tie-breaker. */
  manualOrderIds: string[];
  rules: CatalogRulesConfig;
}

export interface StoreLayout {
  breakpoints: {
    /** Width at which tablet rules apply. */
    tabletMin: number;
    /** Width at which desktop rules apply. */
    desktopMin: number;
  };

  container: {
    /** Max width for .container blocks (px). */
    maxWidth: number;
    /** Horizontal padding for .container blocks (px). */
    paddingX: number;
  };

  catalog: {
    /** Grid (default) or list-like single column on mobile. */
    layoutMode: 'grid' | 'list';
    /** Number of products to show on the landing page (use 'all' to show all). */
    homepageProductLimit: number | 'all';

    cols: {
      mobile: 1 | 2;
      tablet: 2 | 3;
      desktop: 3 | 4;
    };

    gap: {
      mobile: number;  // px
      tablet: number;  // px
      desktop: number; // px
    };
  };

  card: {
    /** Visual density of product cards. */
    density: 'compact' | 'normal' | 'airy';
    radius: number; // px
    shadow: 'none' | 'soft';
    image: {
      /** Image aspect ratio as a string like '4/5' or '1/1'. */
      aspect: '1/1' | '4/5' | '3/4' | '16/9';
      fit: 'cover' | 'contain';
    };
  };
}


export interface StoreConfig {
  brandName: string;
  tagline: string;
  locale: 'ar' | 'fr';
  direction: 'rtl' | 'ltr';

  /** Navigation (V11.6): control header links + hamburger + drawer. */
  nav: {
    enabled: boolean;
    desktopLinks: boolean;
    hamburger: boolean;
    /** Show quick CTA button after scroll (from V11.4). */
    quickCta: boolean;
  };

  /** Catalog menus (V11.6): optional tabs to split products into lists. */
  catalogMenus: {
    enabled: boolean;
    showAll: boolean;
    allLabel: string;
    defaultId: string;
    /** How catalog menu navigation behaves. 'reload' will update the URL and reload the page. */
    navigationMode?: 'filter' | 'reload';
    /** URL query parameter name used when navigationMode is 'reload'. Default: 'cat'. */
    paramName?: string;

    items: Array<{
      id: string;
      label: string;
      /** Filter by categories (uses Product.category). */
      categories?: string[];
      /** Or explicitly list product IDs to include. */
      productIds?: string[];
    }>;
  };


  /** Layout + Grid controls (V10.1). */
  layout: StoreLayout;

  /** Catalog visibility + ordering controls (V10.2). */
  catalogControl: CatalogControl;

  /** Theme tokens mapped to CSS variables (applied at runtime). */
  theme: {
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    accentGold: string;
    accentGoldDim: string;
  };

  /** Preferred contact channel for primary CTAs. */
  preferredChannel: OrderChannel;

  /** Product code prefix (e.g. MA, PRD). */
  productCodePrefix: string;

  /** WhatsApp phone number: digits only (international format). */
  whatsappPhone: string;

  /** Messenger page username or numeric id (e.g., "yourpage" or "123456789"). */
  messengerPage: string;

  /** Message templates (kept short and decision-oriented). */
  messages: {
    productLead: (args: { productName: string; productCode: string; category?: string }) => string;
    conciergeLead: (args: { model: string; budget: string; notes: string }) => string;
    /** Used by generic CTAs (final/sticky) to start a conversation. */
    generalLead: () => string;
  };

  /** High-level copy (brand-agnostic). */
  copy: {
    topBar: string;
    heroTitle: string;
    heroSubtitle: string;
    /** Small label above hero title (e.g. niche). */
    heroTag: string;
    /** Primary hero button label (scrolls to first enabled section). */
    heroPrimaryButtonLabel: string;
    /** Optional hero image source (can be remote URL or /public asset). */
    heroImageSrc: string;
    heroImageAlt: string;
    trustBullets: string[];
    instagramLabel: string;
    instagramHandle: string;

    collectionHint: string;
    contactHint: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;

    /** UI labels / messages (config-only customization). */
    ui: {
      ariaOpenGallery: string;
      ariaOpenProduct: string;
      soldOutOverlay: string;
      placeholderImageBadge: string;
      codeLabel: string;
      availabilityFallback: string;
      leadTimeLabel: string;
      priceOnRequest: string;
      startingFromPrefix: string;
      pricePrefix: string;

      orderViaWhatsApp: string;
      orderViaMessenger: string;
      altWhatsApp: string;
      altMessenger: string;
      unavailableNow: string;

      /** Product sheet (V11) */
      viewDetails: string;
      viewPhotosLabel: string;
      closeLabel: string;
      productSheetAriaLabel: string;

      /** Optional: keep quick order buttons on cards (false recommended). */
      enableQuickOrderButtons: boolean;

      emptyCatalogTitle: string;
      emptyCatalogHint: string;

      /** Generic empty section state (V11.3) */
      emptySectionTitle: string;
      emptySectionHint: string;

      /** Guardrails (V11.5): clamp + fallback behavior */
      maxTitleLines: number;
      maxDescriptionLines: number;
      badgesClamp: number;
      priceFallbackText: string;
      clampLongWords: boolean;
      placeholderProductImage: string;

      videoFullscreenLabel: string;
      videoLoadErrorLabel: string;
      orderVideoViaWhatsApp: string;
      orderVideoViaMessenger: string;

      conciergeTitle: string;
      conciergeModelLabel: string;
      conciergeModelPlaceholder: string;
      conciergeBudgetLabel: string;
      conciergeBudgetPlaceholder: string;
      conciergeNotesLabel: string;
      conciergeNotesPlaceholder: string;
      conciergeSendViaWhatsApp: string;
      conciergeSendViaMessenger: string;

      envMissingWhatsApp: string;
      envMissingMessenger: string;
      toastMessengerCopied: string;
      toastMessengerManual: string;
      toastBuildUpdated: string;
    };

    /** Section titles + short subtitles (edit these for your niche). */
    sections: {
      collectionTitle: string;
      collectionSubtitle: string;

      howTitle: string;
      howSubtitle: string;
      howSteps: { title: string; text: string }[];
      howCtaLabel: string;

      videosTitle: string;
      videosSubtitle: string;
      videoCardSubtitle: string;

      testimonialsTitle: string;
      testimonialsSubtitle: string;
      testimonialsItems: { name: string; quote: string }[];

      whyUsTitle: string;
      whyUsSubtitle: string;
      whyUsItems: { emoji: string; title: string; text: string }[];

      faqTitle: string;
      faqSubtitle: string;

      finalCtaTitle: string;
      finalCtaSubtitle: string;
      finalCtaButtonLabel: string;
      stickyCtaLabel: string;
    };
  };
}

// ENV helpers (keep template safe: no real numbers shipped)
const rawWhatsapp = (import.meta as any).env?.VITE_WHATSAPP_PHONE ?? '';
const digits = String(rawWhatsapp).replace(/\D/g, '');
const normalizedWhatsapp = digits.length === 8 ? ('216' + digits) : digits;

const rawMessenger = (import.meta as any).env?.VITE_MESSENGER_PAGE ?? '';
const normalizedMessenger = String(rawMessenger).trim();

const rawPreset = (import.meta as any).env?.VITE_PRESET ?? '';
const presetIdFromEnv = String(rawPreset).trim();

const preferred = String((import.meta as any).env?.VITE_PREFERRED_CHANNEL ?? 'whatsapp').toLowerCase();
const preferredChannel: OrderChannel = preferred === 'messenger' ? 'messenger' : 'whatsapp';

function getRuntimePresetId(): string | undefined {
  // Priority 1: URL param (useful for demos): ?preset=fashion_modern
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('preset');
      if (p && p.trim()) return p.trim();
    }
  } catch {}
  // Priority 2: ENV (recommended for customers)
  if (presetIdFromEnv) return presetIdFromEnv;
  return undefined;
}

const BASE_CONFIG: StoreConfig = {
  brandName: 'Store App',
  tagline: 'قالب متجر سريع ومرن — قابل للتخصيص عبر ملف واحد',
  locale: 'ar',
  direction: 'rtl',

  nav: {
    enabled: true,
    desktopLinks: true,
    hamburger: true,
    quickCta: true,
  },

  catalogMenus: {
    enabled: false,
    showAll: true,
    allLabel: 'الكل',
    defaultId: 'all',
    navigationMode: 'reload',
    paramName: 'cat',
    items: [
      // Example:
      // { id: 'new', label: 'جديد', categories: ['أخرى'] },
    ],
  },


  layout: {
    breakpoints: { tabletMin: 768, desktopMin: 1024 },
    container: { maxWidth: 1200, paddingX: 24 },
    catalog: {
      layoutMode: 'grid',
      homepageProductLimit: 'all',
      cols: { mobile: 2, tablet: 2, desktop: 3 },
      gap: { mobile: 18, tablet: 22, desktop: 26 },
    },
    card: {
      density: 'normal',
      radius: 16,
      shadow: 'soft',
      image: { aspect: '4/5', fit: 'cover' },
    },
},

catalogControl: {
  hiddenIds: [],
  featured: {
    enabled: false,
    title: 'الأكثر طلبًا',
    ids: [],
    limit: 6,
  },
  sorting: {
    mode: 'default',
    tieBreaker: 'manualThenDefault',
  },
  manualOrderIds: [],
  rules: {
    hideOutOfStock: false,
    treatMissingPriceAs: 'bottom',
  },
},

theme: {
    bgPrimary: '#FCFAF8',
    bgSecondary: '#F5F1EE',
    bgCard: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#595959',
    accentGold: '#D4AF37',
    accentGoldDim: '#C5A028',
  },

  preferredChannel,
  productCodePrefix: 'MA',
  whatsappPhone: normalizedWhatsapp,
  messengerPage: normalizedMessenger,

  messages: {
    productLead: ({ productName, productCode, category }) => (
      `السلام عليكم، نحب نطلب/نحجز.\n\n` +
      `المنتج: ${productName} (الكود: ${productCode})\n` +
      `${category ? `الفئة: ${category}\n` : ''}` +
      `المناسبة: ___\nالتاريخ: ___\nالمدينة: ___\nالميزانية التقريبية: ___\n\n` +
      `هل يوجد مواعيد هذا الأسبوع؟`
    ),
    conciergeLead: ({ model, budget, notes }) => (
      `مرحباً، أود طلب خدمة الاستشارة.\n\n` +
      `الطلب: ${model}\n` +
      `الميزانية: ${budget}\n` +
      `ملاحظات: ${notes}`
    ),
    generalLead: () => (
      `مرحباً، أود الطلب/الاستفسار.\n\n` +
      `المدينة: ___\n` +
      `الميزانية التقريبية: ___\n` +
      `هل يمكن إرسال التفاصيل المتاحة؟`
    ),
  },

  copy: {
    topBar: 'قالب متجر • واتساب + ميسنجر للطلب',
    heroTitle: 'متجر بسيط يبيع بسرعة\nبدون تعقيد',
    heroSubtitle: 'أضف منتجاتك، ثم استقبل الطلبات عبر واتساب أو ميسنجر. مناسب للهاتف وRTL.',
    heroTag: 'Premium • Fast • Mobile-first',
    heroPrimaryButtonLabel: 'تصفّح الكتالوج',
    heroImageSrc: '/assets/hero/hero.webp',
    heroImageAlt: 'Hero image',
    trustBullets: ['خطوات واضحة', 'سريع على الهاتف', 'Responsive', 'CTA واضح', 'سهل التخصيص'],
    instagramLabel: 'انستغرام',
    instagramHandle: '@your.brand',

    collectionHint: 'اضغط على المنتج لعرض التفاصيل، ثم اختر قناة التواصل.',
    contactHint: 'اختر القناة المفضّلة لديك.',
    primaryCtaLabel: 'اطلب الآن',
    secondaryCtaLabel: 'تصفّح المنتجات',

    ui: {
      ariaOpenGallery: 'عرض الصور',
      ariaOpenProduct: 'عرض تفاصيل المنتج',
      soldOutOverlay: 'نفذت الكمية',
      placeholderImageBadge: 'صورة توضيحية',
      codeLabel: 'الكود',
      availabilityFallback: 'تفصيل حسب الطلب',
      leadTimeLabel: 'مدة التنفيذ',
      priceOnRequest: 'السعر: حسب الطلب',
      startingFromPrefix: 'ابتداءً من ',
      pricePrefix: '',

      // Order CTAs
      orderViaWhatsApp: 'اطلب عبر واتساب',
      orderViaMessenger: 'اطلب عبر ميسنجر',
      altWhatsApp: 'بديل: واتساب',
      altMessenger: 'بديل: ميسنجر',
      unavailableNow: 'غير متاح الآن',

      // Product sheet (V11)
      viewDetails: 'عرض التفاصيل',
      viewPhotosLabel: 'عرض الصور',
      closeLabel: 'إغلاق',
      productSheetAriaLabel: 'تفاصيل المنتج',

      // Optional: keep quick-order buttons on cards
      enableQuickOrderButtons: false,

      // Empty states
      emptyCatalogTitle: 'لا توجد منتجات حالياً',
      emptyCatalogHint: 'جرّب لاحقًا أو تواصل معنا مباشرة.',

      emptySectionTitle: 'المحتوى غير متوفر حالياً',
      emptySectionHint: 'يمكنك تعطيل هذا القسم أو إضافة محتواه من الإعدادات.',

      // Guardrails (V11.5): protect UI against bad/missing content
      maxTitleLines: 2,
      maxDescriptionLines: 6,
      badgesClamp: 3,
      priceFallbackText: 'اتصل لمعرفة السعر',
      clampLongWords: true,
      placeholderProductImage: '/assets/placeholder-product.svg',

      // Video
      videoFullscreenLabel: 'شاهد الفيديو داخل شاشة كاملة',
      videoLoadErrorLabel: 'تعذر تشغيل الفيديو من هذه النسخة',
      orderVideoViaWhatsApp: 'اطلب الفيديو على واتساب',
      orderVideoViaMessenger: 'اطلب الفيديو على ميسنجر',

      // Concierge
      conciergeTitle: 'خدمة الكونسيرج الخاصة',
      conciergeModelLabel: 'الطلب/الموديل',
      conciergeModelPlaceholder: 'ما هي قطعة أحلامك؟',
      conciergeBudgetLabel: 'الميزانية التقريبية',
      conciergeBudgetPlaceholder: 'اختر الميزانية',
      conciergeNotesLabel: 'تفضيلات أخرى',
      conciergeNotesPlaceholder: 'مثلاً: لون، خامة، مقاس...',
      conciergeSendViaWhatsApp: 'إرسال عبر واتساب',
      conciergeSendViaMessenger: 'إرسال عبر ميسنجر',
      envMissingWhatsApp: 'يرجى ضبط رقم واتساب في ملف .env (VITE_WHATSAPP_PHONE) ثم إعادة التشغيل.',
      envMissingMessenger: 'يرجى ضبط صفحة ميسنجر في ملف .env (VITE_MESSENGER_PAGE) ثم إعادة التشغيل.',
      toastMessengerCopied: 'تم نسخ الرسالة. افتح ميسنجر ثم الصقها داخل المحادثة.',
      toastMessengerManual: 'افتح ميسنجر ثم أرسل الرسالة يدويًا (لم نتمكن من النسخ تلقائيًا).',
      toastBuildUpdated: 'تم تحديث الموقع… جارٍ إعادة التحميل',

    },

    sections: {
      collectionTitle: 'المنتجات',
      collectionSubtitle: 'اضغط على المنتج لعرض التفاصيل، ثم اختر قناة التواصل.',

      howTitle: 'كيف تعمل العملية؟',
      howSubtitle: '3 خطوات بسيطة من التصفح إلى الطلب.',
      howSteps: [
        { title: 'رسالة سريعة', text: 'أرسل (المدينة + الميزانية + ما تبحث عنه).' },
        { title: 'نقترح لك الخيارات', text: 'نرسل لك الخيارات المتاحة والأسعار.' },
        { title: 'تأكيد ثم توصيل/تنفيذ', text: 'نؤكد التفاصيل ونبدأ التنفيذ.' },
      ],
      howCtaLabel: 'تواصل الآن',

      videosTitle: 'فيديوهات',
      videosSubtitle: 'لقطات قصيرة — يتم التحميل عند الطلب فقط.',
      videoCardSubtitle: 'تشغيل عند الطلب • جودة عالية',

      testimonialsTitle: 'آراء العملاء',
      testimonialsSubtitle: 'مقتطفات قصيرة (يمكن استبدالها لاحقًا بآراء حقيقية).',
      testimonialsItems: [
        { name: 'عميل — تونس', quote: 'الخدمة كانت واضحة وسريعة، والنتيجة ممتازة.' },
        { name: 'عميلة — بن عروس', quote: 'التواصل سريع على واتساب، والتفاصيل كانت مرتبة.' },
        { name: 'زبون — سوسة', quote: 'تجربة محترمة وتسليم في الوقت. ننصح بها.' },
      ],

      whyUsTitle: 'لماذا تختارنا؟',
      whyUsSubtitle: 'وضوح + التزام + نتيجة.',
      whyUsItems: [
        { emoji: '✅', title: 'تواصل واضح', text: 'نحدّد التفاصيل قبل البدء لتفادي المفاجآت.' },
        { emoji: '⏱️', title: 'سرعة في الرد', text: 'رد سريع عبر واتساب/ميسنجر.' },
        { emoji: '🧾', title: 'خطوات منظمة', text: 'من الطلب إلى التسليم بخطوات واضحة.' },
      ],

      faqTitle: 'الأسئلة الشائعة',
      faqSubtitle: 'أجوبة مختصرة لتوفير الوقت.',

      finalCtaTitle: 'جاهز/ة للبدء؟',
      finalCtaSubtitle: 'اضغط على زر التواصل وأرسل تفاصيل بسيطة لنبدأ.',
      finalCtaButtonLabel: 'ابدأ على واتساب/ميسنجر',
      stickyCtaLabel: 'تواصل الآن',
    },
  },
};

const preset = getPresetById(getRuntimePresetId());
export const STORE_CONFIG: StoreConfig = applyPreset(BASE_CONFIG, preset);
