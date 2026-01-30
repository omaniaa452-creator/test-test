# Maison Aura — Elite Landing (WhatsApp + Messenger)

Landing page خفيفة (RTL) مبنية بـ **Vite + TypeScript + React**.

**الهدف التجاري:** المستخدم يختار منتجًا → يرى **كود المنتج** → يضغط زر واحد → تواصل عبر واتساب أو ميسنجر برسالة جاهزة تحتوي **الكود + اسم المنتج** وتطلب **السعر الحالي + صور إضافية**.

## المتطلبات
- Node.js + npm

## 1) إعداد رقم واتساب (إجباري)

> **جديد:** يمكنك تفعيل ميسنجر أيضًا عبر `VITE_MESSENGER_PAGE` وتحديد القناة الافتراضية عبر `VITE_PREFERRED_CHANNEL`.

المشروع لا يشحن رقمًا افتراضيًا. قبل التشغيل/البناء:

1. انسخ `.env.example` إلى `.env`
2. ضع رقم واتساب بصيغة دولية **أرقام فقط** (بدون + أو مسافات)

مثال (تونس):
```
VITE_WHATSAPP_PHONE=21612345678
VITE_MESSENGER_PAGE=your_page_username_or_id
VITE_PREFERRED_CHANNEL=whatsapp   # or: messenger
```

ملاحظة: إذا أدخلت رقمًا تونسيًا محليًا من 8 أرقام فقط (مثال: `24635372`) سيقوم المشروع تلقائيًا بإضافة `216`.

## 2) التشغيل محليًا (Development)
```
npm install
npm run dev
```

## 3) بناء نسخة الإنتاج (Production)
```
npm run build
```

بعد البناء ستجد مجلد `dist/`.

لتجربة `dist` محليًا:
```
cd dist
python -m http.server 8080
```

## 4) أكواد المنتجات (Product Codes)
الكود يُشتق من `product.id` بهذا الشكل:

`TR-${id.padStart(3,'0')}`

مثال:
- id = `1` → TR-001
- id = `12` → TR-012

> مهم: لا تعيد استخدام نفس `id` لمنتجين مختلفين.

## 5) بيانات المنتجات
البيانات الافتراضية موجودة في `constants.ts` داخل `PRODUCTS`.

### خيار اختياري: Google Sheets (بدون سيرفر)
إذا أردت إدارة المنتجات عن بعد، يمكن ربط CSV منشور من Google Sheets عبر متغير `GOOGLE_SHEET_CSV_URL` في `index.tsx`.

## 6) Facebook Pixel (اختياري)
في `index.html` استبدل `YOUR_PIXEL_ID` بالـ Pixel ID الخاص بك.

> تنبيه: PageView يتم تتبعه في `index.html` فقط لتجنب العدّ المكرر.

## ملاحظات جودة قبل التسليم لعميل
- اختبر `npm run build` ثم شغّل `dist/` محليًا قبل أي نشر.
- جرّب على الموبايل:
  - الروابط السريعة
  - drawers (السياسات)
  - زر الطلب في كل منتج
  - زر الرجوع في الهاتف يغلق الـ drawer

## تعديل الهوية والرسائل (بدون داشبورد)
عدّل هذا الملف فقط:
- `data/store.config.ts`

ستجد بداخله:
- اسم المتجر + الشعار النصي
- الألوان (CSS variables)
- طريقة التواصل الافتراضية
- نصوص الرسائل الجاهزة للطلب

## Sections ON/OFF (إظهار/إخفاء الأقسام بدون تعديل الكود)
عدّل هذا الملف:
- `data/sections.config.ts`

هناك خياران بسيطان:
1) `SECTIONS_ENABLED` لتفعيل/تعطيل الأقسام (hero / collection / faq ...)
2) `NAV_ITEMS` للتحكم في روابط شريط التنقل (سيتم عرض الروابط فقط إذا كان القسم مفعّلًا)

> ملاحظة: زر الـ Hero الأساسي يمر تلقائيًا إلى أول قسم مفعّل.

## ملاحظة عن ميسنجر
لا يدعم ميسنجر إدراج رسالة جاهزة في كل الحالات؛ لذلك يقوم القالب بفتح المحادثة ويحاول نسخ الرسالة إلى الحافظة (Clipboard) إن أمكن.


## Presets (اختيار شريحة جاهزة)
يمكنك اختيار شريحة جاهزة لتغيير الهوية والنبرة والألوان بسرعة.

- عبر ملف `.env`:
  - `VITE_PRESET=bridal_luxury` (افتراضي)
  - `VITE_PRESET=fashion_modern`
  - `VITE_PRESET=home_decor`
  - `VITE_PRESET=services_minimal`

- أو عبر الرابط (مفيد للعرض):
  - `/?preset=fashion_modern`


## Sections ON/OFF + Order
Edit: `data/sections.config.ts`

- Enable/disable sections via `SECTIONS_ENABLED`.
- Reorder sections via `SECTION_ORDER` (top-to-bottom). No React edits needed.
- Nav items are filtered automatically based on enabled sections.

Example:
```ts
export const SECTION_ORDER: SectionKey[] = [
  'hero',
  'collection',
  'videos',
  'testimonials',
  'faq',
  'whyUs',
  'trustBar',
  'how',
];
```


## Presets (V11.1)
You can preview presets via URL: `?preset=perfume_minimal` etc. For customer builds, set `VITE_PRESET` in `.env`.

Available: bridal_luxury, fashion_modern, home_decor, services_minimal, perfume_minimal, restaurant_menu, electronics_deals, beauty_salon, handmade_artisan.
---

## V11.2 — Packaging & Sales Kit
This release adds documentation to help you **sell and deliver** the product faster:

- `SELLER_GUIDE.md` — how to pitch, offers, upsells
- `CLIENT_HANDOVER.md` — what the client receives
- `EDIT_QUICKSTART.md` — customize in ~15 minutes
- `CHECKLIST_RELEASE.md` — pre-delivery QA checklist
- `PRICING_PACKAGES.md` — suggested packages for Tunisia
