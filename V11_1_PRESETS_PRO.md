# V11.1 — Presets Pro (Industry Kits)

## Goal
Speed up client delivery by switching niche targeting via configuration only.

## What’s included
- Expanded preset set for common Tunisian SMB niches:
  - Perfume/Cosmetics
  - Restaurant/Café menu
  - Electronics/Deals
  - Beauty salon/booking
  - Handmade/artisan
- `PRESET_CHEATSHEET.md` with simple selection guidance.

## Files changed
- `data/presets.ts` (new presets + updated PresetId union)

## QA checklist
- Switch `activePresetId` in `data/store.config.ts` to each preset ID.
- Confirm layout changes (mobile/tablet/desktop).
- Confirm catalog sorting (featured-first, manual, in-stock-first).
- Confirm primary order channel (WhatsApp vs Messenger).
