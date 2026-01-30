# Edit Quickstart (15 minutes)

This project is designed for **config-based customization**.

## Step 0 — Install
```bash
npm install
npm run dev -- --host
```

## Step 1 — Choose a preset
Open:
- `data/presets.ts`

Pick one preset name, then set it:
- via URL: `?preset=perfume_minimal`
- or via env: `VITE_PRESET=perfume_minimal`

## Step 2 — Update copy (texts)
Open:
- `data/store.config.ts`

Edit:
- hero title/subtitle
- trust bullets
- section titles
- CTA labels

## Step 3 — Update products
Open:
- `data/catalog.ts`

Each product:
- `id` (unique)
- `title`
- `price`
- `image` or `images`
- `description`
- `tags` (optional)
- `inStock` / `isSoldOut` (optional)

## Step 4 — Ordering channels
Open:
- `data/store.config.ts`

Set:
- WhatsApp number
- Messenger page link/ID
- default channel

## Step 5 — Layout and catalog control
- Layout (grid, cols, gaps): `STORE_CONFIG.layout` (V10.1)
- Featured/Sorting/Hidden/Manual: `STORE_CONFIG.catalogControl` (V10.2)

## Release build
```bash
npm run build
npm run preview -- --host
```
