# V11 – Product Sheet + Tablet/Desktop Polish

This version upgrades the product interaction to a single **Product Sheet** (bottom sheet on mobile / centered modal on larger screens).

## What changed
- **Product cards** now open the Product Sheet (instead of immediate ordering).
- Product Sheet contains:
  - Product image, code, availability
  - Price, specs, lead time
  - Optional “View photos” (opens the existing Gallery Modal)
  - Primary + secondary order CTAs (WhatsApp/Messenger)
- **Swipe down to close** (mobile): drag the sheet down and release.
- **Tablet spacing + desktop polish**: centered sheet with improved max-width.

## Config keys
All labels are editable in `data/store.config.ts` under `copy.ui`:
- `ariaOpenProduct`
- `viewDetails`
- `viewPhotosLabel`
- `closeLabel`
- `productSheetAriaLabel`

Optional:
- `enableQuickOrderButtons` (keep quick order buttons on cards; recommended `false`).

## Notes
- No backend.
- No dashboard.
- No new product data fields were added.
