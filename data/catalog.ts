/**
 * Demo catalog data (edit to your niche).
 * Keep everything static, or later replace with CSV/JSON.
 */
import { Product, FAQItem, VideoItem } from '../types';

const p = (rel: string) => `/assets/${rel}`; // served from /public

export const PRODUCTS: Product[] = [
  {
    id: 'p01',
    name: 'فستان زفاف كلاسيكي — تطريز يدوي',
    image: p('products/p01/cover.jpg'),
    images: [
      p('products/p01/cover.jpg'),
      p('products/p01/01.jpg'),
      p('products/p01/02.jpg'),
      p('products/p01/03.jpg'),
      p('products/p01/04.jpg'),
    ],
    price: 0,
    currency: 'TND',
    startingFrom: true,
    availabilityLabel: 'تفصيل حسب الطلب',
    badges: ['Premium', 'حسب المقاس'],
    specs: 'تطريز يدوي، قماش ساتان فاخر، إمكانية تعديل القَصّة.',
    leadTime: '10–21 يوم',
    category: 'زفاف',
  },
  {
    id: 'p02',
    name: 'فستان خطوبة — لمسة عصرية',
    image: p('products/p02/cover.jpg'),
    images: [
      p('products/p02/cover.jpg'),
      p('products/p02/01.jpg'),
      p('products/p02/02.jpg'),
      p('products/p02/03.jpg'),
    ],
    price: 0,
    currency: 'TND',
    startingFrom: true,
    availabilityLabel: 'تفصيل حسب الطلب',
    badges: ['New', 'حسب المقاس'],
    specs: 'قصّة عصرية، خامات راقية، تعديلات حسب الطلب.',
    leadTime: '10–21 يوم',
    category: 'خطوبة',
  },
  {
    id: 'p03',
    name: 'فستان سواريه — أناقة ناعمة',
    image: p('products/p03/cover.jpg'),
    images: [
      p('products/p03/cover.jpg'),
      p('products/p03/01.jpg'),
      p('products/p03/02.jpg'),
      p('products/p03/03.jpg'),
      p('products/p03/04.jpg'),
      p('products/p03/05.jpg'),
    ],
    price: 0,
    currency: 'TND',
    startingFrom: true,
    availabilityLabel: 'تفصيل حسب الطلب',
    badges: ['Elegant'],
    specs: 'تفاصيل هادئة، خامات فاخرة، تشطيب نظيف.',
    leadTime: '7–14 يوم',
    category: 'سوارية',
  },
  {
    id: 'p04',
    name: 'فستان سهرات — لمعة خفيفة',
    image: p('products/p04/cover.jpg'),
    images: [
      p('products/p04/cover.jpg'),
      p('products/p04/01.jpg'),
      p('products/p04/02.jpg'),
      p('products/p04/03.jpg'),
    ],
    price: 0,
    currency: 'TND',
    startingFrom: true,
    availabilityLabel: 'تفصيل حسب الطلب',
    badges: ['Limited'],
    specs: 'لمعان خفيف، تفاصيل رقيقة، مناسب للحفلات.',
    leadTime: '7–14 يوم',
    category: 'سوارية',
  },
];

/**
 * Videos are optional. Keep this empty by default.
 * When you add at least one video with a valid `src`, the Videos section will appear automatically.
 */
export const VIDEOS: VideoItem[] = [];

/** FAQ section */
export const FAQS: FAQItem[] = [
  { id: 'f1', question: 'كيف تتم جلسة القياس؟', answer: 'نحدد موعدًا، ثم نقيس بدقة ونتفق على التفاصيل قبل البدء.' },
  { id: 'f2', question: 'هل يمكن تعديل التصميم بعد البدء؟', answer: 'نعم ضمن حدود متفق عليها حسب مرحلة العمل.' },
  { id: 'f3', question: 'كم مدة التسليم؟', answer: 'عادة بين 7 إلى 21 يومًا حسب نوع القطعة وجدول العمل.' },
];
