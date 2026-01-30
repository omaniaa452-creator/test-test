# V10.1 — Grid + Layout Control Pack

This release makes the storefront **fully controllable** (per segment) without touching React components.

## Where to edit
- `data/store.config.ts` → `layout` block

## What you can control

### 1) Columns per device
```ts
layout: {
  catalog: {
    cols: { mobile: 2, tablet: 2, desktop: 3 }
  }
}
```

- **mobile**: 1 or 2
- **tablet**: 2 or 3
- **desktop**: 3 or 4

### 2) Gaps (spacing between cards)
```ts
layout: {
  catalog: {
    gap: { mobile: 18, tablet: 22, desktop: 26 }
  }
}
```

### 3) Card density (compact / normal / airy)
```ts
layout: {
  card: { density: 'normal' }
}
```

Density affects:
- inner padding
- title/meta font sizes
- CTA height

### 4) Image aspect ratio
```ts
layout: {
  card: { image: { aspect: '4/5', fit: 'cover' } }
}
```

Supported aspects:
- `1/1`, `4/5`, `3/4`, `16/9`

### 5) Homepage product limit
```ts
layout: {
  catalog: { homepageProductLimit: 12 } // or 'all'
}
```

### 6) Mobile catalog mode (grid vs list-like)
```ts
layout: {
  catalog: { layoutMode: 'grid' } // or 'list'
}
```

`list` forces 1 column on small screens (useful for services).

## Presets
Presets may override layout as well:
- `data/presets.ts`

## Acceptance checklist
- Mobile can switch between 1 and 2 columns
- Tablet and desktop columns follow config
- No horizontal scrolling
- `npm run build` succeeds