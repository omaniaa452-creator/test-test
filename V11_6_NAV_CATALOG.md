# V11.6 — Navigation Controls + Catalog Menus

This update adds **config-only** controls to retarget the same template as either:
- a **simple landing page** (no hamburger / no desktop links), or
- a **multi-section store** (desktop links + mobile drawer)

It also adds optional **Catalog Menus** (tabs) to split the product list into multiple “lists” (e.g., New / Deals / Categories).

## 1) Navigation controls (Header / Hamburger)

Edit: `data/store.config.ts` → `nav`

```ts
nav: {
  enabled: true,        // master toggle for header + drawer
  desktopLinks: true,   // show/hide desktop nav links
  hamburger: true,      // show/hide mobile hamburger + drawer
  quickCta: true,       // show/hide the floating quick CTA (from V11.4)
},
```

### Recommended presets
- **Landing page (minimal)**:
  - `enabled: false` (or `enabled: true`, `desktopLinks:false`, `hamburger:false`)
- **Store (full)**:
  - `enabled:true`, `desktopLinks:true`, `hamburger:true`

## 2) Catalog Menus (Tabs)

Edit: `data/store.config.ts` → `catalogMenus`

```ts
catalogMenus: {
  enabled: true,
  showAll: true,
  allLabel: 'الكل',
  defaultId: 'all',
  items: [
    { id: 'bridal', label: 'زفاف', categories: ['زفاف'] },
    { id: 'engagement', label: 'خطوبة', categories: ['خطوبة'] },
    // or explicit IDs:
    // { id: 'featured', label: 'الأكثر طلبًا', productIds: ['MA-001','MA-002'] },
  ],
},
```

### Notes
- If `enabled=false`, behavior is unchanged (single product grid).
- The filter is applied **before** catalog control (featured/hide/sort), so featured is also filtered to the active menu.

## 3) QA checklist (quick)
- `npm run build` succeeds.
- Mobile:
  - hamburger open/close works (if enabled)
  - scroll-to-section doesn't hide titles under header
  - catalog tabs switch products correctly
- Desktop:
  - nav active link updates while scrolling (if enabled)

