# V11.3 — Sections Pro (Per‑Section UI Controls)

This update adds **config-only** controls to tune each section’s layout and spacing without touching React.

## What’s new

### 1) Per-section UI controls
Edit:
- `data/sections.config.ts` → `SECTION_UI`

For each section you can control:
- `variant`: `default` | `compact` | `featured`
- `spacing`: `tight` | `normal` | `roomy`
- `width`: `container` | `full` | `narrow`
- `bg`: `none` | `soft` | `gradient`

Example:
```ts
export const SECTION_UI = {
  collection: { variant: 'default', spacing: 'normal', width: 'container', bg: 'none' },
  whyUs: { variant: 'featured', spacing: 'roomy', width: 'full', bg: 'soft' },
  // ...
};
```

### 2) Safe empty states (no broken UI)
If a section is enabled but its content array is empty, the app shows a clean empty-state block instead of rendering broken layouts.

Config texts:
- `data/store.config.ts` → `copy.ui.emptySectionTitle`
- `data/store.config.ts` → `copy.ui.emptySectionHint`

## Notes
- No architecture changes.
- No new backend/dashboard.
- Existing order flow + product sheet remain unchanged.
