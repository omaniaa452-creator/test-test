import type { StoreConfig } from './store.config';
import type { OrderChannel } from './store.config';

export type PresetId = 'bridal_luxury' | 'fashion_modern' | 'home_decor' | 'services_minimal' | 'perfume_minimal' | 'restaurant_menu' | 'electronics_deals' | 'beauty_salon' | 'handmade_artisan';

export interface StorePreset {
  id: PresetId;
  name: string;
  /** Partial overrides applied on top of the base StoreConfig (deep-partial for nested objects). */
  overrides: Partial<Omit<StoreConfig, 'theme' | 'copy' | 'messages' | 'layout' | 'catalogControl'>> & {
    theme?: Partial<StoreConfig['theme']>;
    layout?: Partial<Omit<StoreConfig['layout'], 'breakpoints' | 'container' | 'catalog' | 'card'>> & {
      breakpoints?: Partial<StoreConfig['layout']['breakpoints']>;
      container?: Partial<StoreConfig['layout']['container']>;
      catalog?: Partial<Omit<StoreConfig['layout']['catalog'], 'cols' | 'gap'>> & {
        cols?: Partial<StoreConfig['layout']['catalog']['cols']>;
        gap?: Partial<StoreConfig['layout']['catalog']['gap']>;
      };
      card?: Partial<Omit<StoreConfig['layout']['card'], 'image'>> & {
        image?: Partial<StoreConfig['layout']['card']['image']>;
      };
    };
    copy?: Partial<Omit<StoreConfig['copy'], 'sections'>> & {
      sections?: Partial<StoreConfig['copy']['sections']>;
    };
    messages?: Partial<StoreConfig['messages']>;

    /** Deep-partial catalog controls (V10.2+). */
    catalogControl?: Partial<Omit<StoreConfig['catalogControl'], 'featured' | 'sorting' | 'rules'>> & {
      featured?: Partial<StoreConfig['catalogControl']['featured']>;
      sorting?: Partial<StoreConfig['catalogControl']['sorting']>;
      rules?: Partial<StoreConfig['catalogControl']['rules']>;
    };
  };
}

/**
 * Presets are meant to help you retarget the SAME template to different niches
 * without touching React components.
 *
 * Tip: keep images generic and unbranded inside /public and /assets.
 */
export const PRESETS: StorePreset[] = [
  {
    id: 'bridal_luxury',
    name: 'Bridal Luxury (Default)',
    overrides: {
      layout: { catalog: { layoutMode: 'grid', cols: { mobile: 1, tablet: 2, desktop: 3 } }, card: { density: 'airy', image: { aspect: '4/5' } } },

      brandName: 'Maison Aura',
      tagline: 'تفصيل راقٍ حسب الطلب — مواعيد محدودة شهريًا',
      preferredChannel: 'whatsapp',
      copy: {
        topBar: 'تفصيل راقٍ للعروس • Bridal & Heritage • واتساب + ميسنجر للحجز',
        heroTitle: 'دار تفصيل راقٍ للعروس…\nبلمسة تراثية تليق بيومك',
        heroSubtitle: 'فساتين زفاف وخطوبة مُفصّلة حسب الطلب. جلسة قياس + متابعة واضحة حتى التسليم.',
        heroTag: 'Haute Couture • Bridal & Heritage',
        heroPrimaryButtonLabel: 'تصفّحي التصاميم',
        heroImageAlt: 'Bridal Couture',
        trustBullets: ['خطوات واضحة + عربون', 'مواعيد محدودة لضمان الجودة', 'تفصيل حسب المقاس'],
        instagramLabel: 'انستغرام',
        instagramHandle: '@maison.aura.by.ch',
        sections: {
          collectionTitle: 'التصاميم',
          collectionSubtitle: 'اضغطي على المنتج لعرض ألبوم الصور، ثم احجزي عبر واتساب أو ميسنجر.',

          howTitle: 'كيف تتم التجربة؟ (3 خطوات)',
          howSubtitle: 'نظام واضح يقلّل التوتر ويضمن نتيجة نهائية ممتازة.',
          howSteps: [
            { title: 'رسالة سريعة', text: 'المناسبة + التاريخ + المدينة + الميزانية التقريبية.' },
            { title: 'موعد قياس واقتراح ستايلات', text: 'نقترح 2–3 ستايلات حسب الجسم والذوق.' },
            { title: 'جلسات متابعة ثم تسليم', text: 'متابعة حتى آخر لمسة قبل الموعد.' },
          ],
          howCtaLabel: 'احجزي الآن',

          videosTitle: 'لقطات من العرض (فيديو)',
          videosSubtitle: 'اضغطي على أي بطاقة لفتح الفيديو داخل شاشة كاملة (تحميل عند الطلب فقط).',
          videoCardSubtitle: 'تشغيل عند الطلب • جودة عالية',

          testimonialsTitle: 'تجارب العرائس',
          testimonialsSubtitle: 'آراء قصيرة (استبدليها لاحقًا بآراء حقيقية + صور).',
          testimonialsItems: [
            { name: 'عروس — تونس', quote: 'تفاصيل وخياطة راقية. القياس كان واضح والنتيجة النهائية فاقت التوقعات.' },
            { name: 'مخطوبة — بن عروس', quote: 'التواصل سريع، وفهموا الستايل اللي نحب عليه من أول مرة.' },
            { name: 'عائلة العروس', quote: 'تنظيم المواعيد ممتاز والتسليم كان في الوقت. شكراً على الاحترافية.' },
          ],

          whyUsTitle: 'لماذا هذا الأسلوب يطمّنك؟',
          whyUsSubtitle: 'هنا نركّز على القرار: ثقة + وضوح + نتيجة',
          whyUsItems: [
            { emoji: '🧵', title: 'تفاصيل تظهر في الكاميرا', text: 'تشطيب نظيف، خطوط متوازنة، وتطريز مدروس — ليس مجرد شكل.' },
            { emoji: '📏', title: 'قياسات + متابعة', text: 'جلسات واضحة حتى الوصول للنتيجة النهائية قبل الموعد.' },
            { emoji: '🗓️', title: 'مواعيد محدودة', text: 'حجوزات شهرية محدودة لضمان الجودة والالتزام بالوقت.' },
          ],

          faqTitle: 'الأسئلة الشائعة',
          faqSubtitle: 'أجوبة سريعة قبل الحجز.',

          finalCtaTitle: 'جاهزة نبدأ؟',
          finalCtaSubtitle: 'ارسلي: (المناسبة + التاريخ + المدينة + الميزانية التقريبية). نحدّد لك أقرب موعد.',
          finalCtaButtonLabel: 'احجزي الآن',
          stickyCtaLabel: 'احجزي الآن',
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
    },
  },
  {
    id: 'fashion_modern',
    name: 'Modern Fashion',
    overrides: {
      layout: { catalog: { layoutMode: 'grid', cols: { mobile: 2, tablet: 2, desktop: 4 } }, card: { density: 'normal', image: { aspect: '4/5' } } },

      brandName: 'Studio Mode',
      tagline: 'قطع محدودة • جودة ممتازة • توصيل سريع',
      preferredChannel: 'messenger',
      copy: {
        topBar: 'New drops weekly • Fashion essentials • WhatsApp + Messenger',
        heroTitle: 'ستايل يومك يبدأ هنا\nقطع مختارة بعناية',
        heroSubtitle: 'موديلات عصرية بجودة ممتازة. اختاري المقاس، واطلبي بسرعة عبر واتساب أو ميسنجر.',
        trustBullets: ['توصيل سريع داخل تونس', 'دفع عند الاستلام (حسب المنطقة)', 'استبدال خلال 48 ساعة'],
        instagramLabel: 'Instagram',
        instagramHandle: '@studio.mode',
      },
      theme: {
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F6F7FB',
        bgCard: '#FFFFFF',
        textPrimary: '#111827',
        textSecondary: '#4B5563',
        accentGold: '#111827',
        accentGoldDim: '#374151',
      },
      catalogControl: {
        hiddenIds: [],
        featured: {
          enabled: true,
          title: 'الأكثر طلبًا',
          ids: ['p03', 'p01', 'p02'],
          limit: 3,
        },
        sorting: {
          mode: 'featuredFirst',
          tieBreaker: 'manualThenDefault',
        },
        manualOrderIds: ['p03', 'p01', 'p02', 'p04'],
        rules: {
          hideOutOfStock: false,
          treatMissingPriceAs: 'bottom',
        },
      },
    },
  },
  {
    id: 'home_decor',
    name: 'Home Decor',
    overrides: {
      layout: { catalog: { layoutMode: 'grid', cols: { mobile: 2, tablet: 3, desktop: 4 } }, card: { density: 'normal', image: { aspect: '1/1' } } },

      brandName: 'Aura Home',
      tagline: 'ديكور هادئ • قطع أنيقة • لمسة منزل',
      preferredChannel: 'whatsapp',
      copy: {
        topBar: 'Home & Decor • قطع أنيقة • WhatsApp + Messenger',
        heroTitle: 'ديكور بسيط\nيجعل بيتك أجمل',
        heroSubtitle: 'منتجات ديكور مختارة بعناية. تصفّحي الكتالوج واطلبي مباشرة.',
        trustBullets: ['تغليف آمن', 'خدمة ما بعد البيع', 'توصيل لكل الولايات'],
        instagramLabel: 'انستغرام',
        instagramHandle: '@aura.home',
      },
      theme: {
        bgPrimary: '#FBFAF7',
        bgSecondary: '#F2F1EA',
        bgCard: '#FFFFFF',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        accentGold: '#2F6F5E',
        accentGoldDim: '#255B4D',
      },
    },
  },
  {
    id: 'services_minimal',
    name: 'Services Minimal',
    overrides: {
      layout: { catalog: { layoutMode: 'list', cols: { mobile: 1 } }, card: { density: 'airy' } },

      brandName: 'Pro Services',
      tagline: 'خدمات واضحة • نتائج سريعة • تواصل مباشر',
      preferredChannel: 'messenger',
      copy: {
        topBar: 'Services • Book fast • WhatsApp + Messenger',
        heroTitle: 'احجز خدمتك بسهولة\nمن صفحة واحدة',
        heroSubtitle: 'وصف الخدمة، الأسعار، وطريقة الحجز. نردّ عليك بسرعة عبر واتساب أو ميسنجر.',
        trustBullets: ['أسعار واضحة', 'حجز سريع', 'متابعة حتى التسليم'],
        instagramLabel: 'Instagram',
        instagramHandle: '@pro.services',
      },
      theme: {
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F3F4F6',
        bgCard: '#FFFFFF',
        textPrimary: '#111827',
        textSecondary: '#4B5563',
        accentGold: '#2563EB',
        accentGoldDim: '#1D4ED8',
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
          mode: 'manual',
          tieBreaker: 'manualThenDefault',
        },
        manualOrderIds: ['p01', 'p02', 'p03', 'p04'],
        rules: {
          hideOutOfStock: true,
          treatMissingPriceAs: 'bottom',
        },
      },
    },
  },

  {
    id: 'perfume_minimal',
    name: 'Perfume / Cosmetics (Fast Browse)',
    overrides: {
      layout: {
        catalog: { layoutMode: 'grid', cols: { mobile: 2, tablet: 3, desktop: 4 }, gap: { mobile: 10, tablet: 12, desktop: 14 } },
        card: { density: 'compact', image: { aspect: '1/1', fit: 'cover' } },
      },
      brandName: 'Your Brand',
      tagline: 'عطور ومستحضرات أصلية • توصيل سريع داخل تونس',
      preferredChannel: 'whatsapp',
      copy: {
        topBar: 'عروض اليوم • Perfume & Beauty • اطلب عبر واتساب',
        heroTitle: 'اختاري عطرك…\\nوطلبي في دقيقة',
        heroSubtitle: 'تصفّحي الأكثر طلبًا. تفاصيل واضحة + توصيل سريع.',
        heroTag: 'Perfume • Beauty',
        heroPrimaryButtonLabel: 'شوفي العروض',
        trustBullets: ['منتجات منتقاة', 'توصيل سريع', 'دفع عند الاستلام (اختياري)'],
      },
      catalogControl: {
        sorting: { mode: 'featuredFirst', tieBreaker: 'manualThenDefault' },
        rules: { hideOutOfStock: false, treatMissingPriceAs: 'bottom' },
      },
    },
  },
  {
    id: 'restaurant_menu',
    name: 'Restaurant / Café (Menu Style)',
    overrides: {
      layout: {
        catalog: { layoutMode: 'list', cols: { mobile: 1, tablet: 2, desktop: 3 }, gap: { mobile: 10, tablet: 12, desktop: 14 } },
        card: { density: 'normal', image: { aspect: '16/9', fit: 'cover' } },
      },
      brandName: 'Your Restaurant',
      tagline: 'قائمة اليوم • توصيل/تيك أواي • اطلب عبر واتساب',
      preferredChannel: 'whatsapp',
      copy: {
        topBar: 'Menu • Delivery / Takeaway • WhatsApp',
        heroTitle: 'شنوّة تحب تاكل اليوم؟',
        heroSubtitle: 'قائمة واضحة + طلب سريع عبر واتساب. اكتب العنوان ونثبتولك الطلب.',
        heroTag: 'Menu • Delivery',
        heroPrimaryButtonLabel: 'شوفي المنيو',
        trustBullets: ['تأكيد سريع', 'وقت تسليم واضح', 'خدمة محترمة'],
      },
      catalogControl: {
        sorting: { mode: 'manual', tieBreaker: 'manualThenDefault' },
        rules: { hideOutOfStock: true, treatMissingPriceAs: 'bottom' },
      },
    },
  },
  {
    id: 'electronics_deals',
    name: 'Electronics / Deals (Specs First)',
    overrides: {
      layout: {
        catalog: { layoutMode: 'grid', cols: { mobile: 2, tablet: 3, desktop: 4 }, gap: { mobile: 10, tablet: 12, desktop: 14 } },
        card: { density: 'compact', image: { aspect: '1/1', fit: 'contain' } },
      },
      brandName: 'Your Store',
      tagline: 'إلكترونيات • ضمان • مقارنة سريعة',
      preferredChannel: 'messenger',
      copy: {
        topBar: 'Deals • Specs • Messenger/WhatsApp',
        heroTitle: 'اختار الجهاز…\\nوخلّي الطلب سهل',
        heroSubtitle: 'مواصفات واضحة + صور. نبعثولك تأكيد سريع عبر ميسنجر أو واتساب.',
        heroTag: 'Electronics • Deals',
        heroPrimaryButtonLabel: 'شوفي المنتجات',
        trustBullets: ['مواصفات واضحة', 'ضمان حسب المنتج', 'تأكيد سريع'],
      },
      catalogControl: {
        sorting: { mode: 'inStockFirst', tieBreaker: 'manualThenDefault' },
        rules: { hideOutOfStock: false, treatMissingPriceAs: 'bottom' },
      },
    },
  },
  {
    id: 'beauty_salon',
    name: 'Beauty Salon / Booking (Services)',
    overrides: {
      layout: {
        catalog: { layoutMode: 'list', cols: { mobile: 1, tablet: 2, desktop: 3 }, gap: { mobile: 12, tablet: 14, desktop: 16 } },
        card: { density: 'airy', image: { aspect: '4/5', fit: 'cover' } },
      },
      brandName: 'Your Salon',
      tagline: 'حجز مواعيد • باقات • واتساب/ميسنجر',
      preferredChannel: 'whatsapp',
      copy: {
        topBar: 'Booking • Beauty • WhatsApp',
        heroTitle: 'احجزي موعدك بسهولة',
        heroSubtitle: 'اختاري الخدمة، اكتبي الوقت المناسب، ونثبتولك الحجز بسرعة.',
        heroTag: 'Booking • Services',
        heroPrimaryButtonLabel: 'شوفي الخدمات',
        trustBullets: ['حجز سريع', 'أسعار واضحة', 'متابعة محترفة'],
      },
      catalogControl: {
        sorting: { mode: 'manual', tieBreaker: 'manualThenDefault' },
        rules: { hideOutOfStock: true, treatMissingPriceAs: 'bottom' },
      },
    },
  },
  {
    id: 'handmade_artisan',
    name: 'Handmade / Artisan (Story + Trust)',
    overrides: {
      layout: {
        catalog: { layoutMode: 'grid', cols: { mobile: 1, tablet: 2, desktop: 3 }, gap: { mobile: 12, tablet: 14, desktop: 16 } },
        card: { density: 'normal', image: { aspect: '4/5', fit: 'cover' } },
      },
      brandName: 'Your Atelier',
      tagline: 'صُنع يدوي • قطع محدودة • حسب الطلب',
      preferredChannel: 'whatsapp',
      copy: {
        topBar: 'Handmade • Limited Pieces • WhatsApp',
        heroTitle: 'قطع يدوية…\\nبلمسة خاصة',
        heroSubtitle: 'اختاري القطعة، وابعثي طلبك عبر واتساب. نثبتولك التفاصيل قبل التنفيذ.',
        heroTag: 'Handmade • Limited',
        heroPrimaryButtonLabel: 'تصفّحي القطع',
        trustBullets: ['قطع محدودة', 'تأكيد قبل التنفيذ', 'تغليف محترم'],
      },
      catalogControl: {
        sorting: { mode: 'featuredFirst', tieBreaker: 'manualThenDefault' },
        rules: { hideOutOfStock: false, treatMissingPriceAs: 'bottom' },
      },
    },
  },
];

export function getPresetById(id: string | null | undefined): StorePreset | undefined {
  if (!id) return undefined;
  const clean = String(id).trim().toLowerCase();
  return PRESETS.find(p => p.id === clean);
}

/**
 * Lightweight deep-merge for StoreConfig preset overrides.
 * - primitives: override
 * - objects: shallow merge (and for theme/copy we merge keys)
 */
export function applyPreset(base: StoreConfig, preset?: StorePreset): StoreConfig {
  if (!preset) return base;

  const merged: StoreConfig = {
    ...base,
    ...preset.overrides,
layout: {
  ...base.layout,
  ...((preset.overrides as any).layout ?? {}),
  breakpoints: {
    ...base.layout.breakpoints,
    ...(((preset.overrides as any).layout ?? {}).breakpoints ?? {}),
  },
  container: {
    ...base.layout.container,
    ...(((preset.overrides as any).layout ?? {}).container ?? {}),
  },
  catalog: {
    ...base.layout.catalog,
    ...(((preset.overrides as any).layout ?? {}).catalog ?? {}),
    cols: {
      ...base.layout.catalog.cols,
      ...((((preset.overrides as any).layout ?? {}).catalog ?? {}).cols ?? {}),
    },
    gap: {
      ...base.layout.catalog.gap,
      ...((((preset.overrides as any).layout ?? {}).catalog ?? {}).gap ?? {}),
    },
  },
  card: {
    ...base.layout.card,
    ...(((preset.overrides as any).layout ?? {}).card ?? {}),
    image: {
      ...base.layout.card.image,
      ...((((preset.overrides as any).layout ?? {}).card ?? {}).image ?? {}),
    },
  },

},
    catalogControl: {
      ...base.catalogControl,
      ...(((preset.overrides as any).catalogControl ?? {}) as any),
      featured: {
        ...base.catalogControl.featured,
        ...((((preset.overrides as any).catalogControl ?? {}) as any).featured ?? {}),
      },
      sorting: {
        ...base.catalogControl.sorting,
        ...((((preset.overrides as any).catalogControl ?? {}) as any).sorting ?? {}),
      },
      rules: {
        ...base.catalogControl.rules,
        ...((((preset.overrides as any).catalogControl ?? {}) as any).rules ?? {}),
      },
    },
    theme: {
      ...base.theme,
      ...(preset.overrides.theme ?? {}),
    },
    copy: {
      ...base.copy,
      ...(preset.overrides.copy ?? {}),
      sections: {
        ...base.copy.sections,
        ...((preset.overrides.copy as any)?.sections ?? {}),
      },
    },
    messages: {
      ...base.messages,
      ...(preset.overrides.messages ?? {}),
    },
  };

  return merged;
}