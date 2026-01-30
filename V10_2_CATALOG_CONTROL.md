# V10.2 — Catalog Control (Sorting • Featured • Hidden • Manual Order)

This release adds **catalog visibility + ordering controls** via config only (no dashboard).

## Where to edit
- `data/store.config.ts` → `catalogControl`
- `data/presets.ts` → each preset can override `catalogControl`
- (Logic) `data/catalog.control.ts` (pure helpers)

## Features
### 1) Hidden products
Hide any product everywhere by ID:
- `catalogControl.hiddenIds`

### 2) Featured section (homepage)
Enable/disable:
- `catalogControl.featured.enabled`

Order and pick products by ID:
- `catalogControl.featured.ids`

Limit items:
- `catalogControl.featured.limit`

### 3) Sorting modes
- `default`: keep `catalog.ts` order
- `manual`: follow `manualOrderIds` then the rest
- `featuredFirst`: featured items first, then the rest
- `inStockFirst`: in-stock first (`inStock !== false`)
- `priceAsc` / `priceDesc`: sort by price (0/undefined treated as missing)

Tie breaker:
- `manualThenDefault` (recommended)
- `defaultOnly`

### 4) Rules
- `hideOutOfStock`: if true, products with `inStock=false` are hidden
- `treatMissingPriceAs`: `bottom` (recommended) or `zero`

## Quick examples

### Fashion preset
```ts
catalogControl: {
  hiddenIds: [],
  featured: { enabled: true, title: 'الأكثر طلبًا', ids: ['p03','p01','p02'], limit: 3 },
  sorting: { mode: 'featuredFirst', tieBreaker: 'manualThenDefault' },
  manualOrderIds: ['p03','p01','p02','p04'],
  rules: { hideOutOfStock: false, treatMissingPriceAs: 'bottom' }
}
```

### Services preset
```ts
catalogControl: {
  hiddenIds: [],
  featured: { enabled: false, title: 'الأكثر طلبًا', ids: [], limit: 6 },
  sorting: { mode: 'manual', tieBreaker: 'manualThenDefault' },
  manualOrderIds: ['p01','p02','p03','p04'],
  rules: { hideOutOfStock: true, treatMissingPriceAs: 'bottom' }
}
```

## Acceptance checklist
- Adding an ID to `hiddenIds` hides it everywhere.
- Featured section appears only when enabled and `featured.ids` contains valid product IDs.
- No crashes if IDs are missing/invalid.
- `npm run build` succeeds.
