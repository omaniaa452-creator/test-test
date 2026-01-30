# V10.3 — UX Polish + Refresh Feel

This release focuses on **sellable UX improvements** that reduce friction on Android/mobile and reduce post-sale support.

## What changed

### 1) Skeleton + image loading polish
- Product card images now show a subtle shimmer until the image is loaded.
- Images fade-in to reduce jarring jumps and perceived slowness.

### 2) Remote sheet loading (best-effort)
- If you use a Google Sheet CSV URL, the catalog shows a small skeleton grid while loading.

### 3) Refresh feel (stale-cache protection)
- Added `public/build.json` with version `10.3.0` and a build timestamp.
- On app start, the site fetches `build.json` (no-store). If the version changed since last visit, the page reloads once automatically.

This reduces “why is the site not updated?” issues for non-technical buyers.

## Files touched
- `public/build.json` (new)
- `utils.ts` (build update check)
- `index.tsx` (calls build update check + skeleton rendering)
- `components/ProductCard.tsx` (image loading polish)
- `components/GalleryModal.tsx` (image loading polish)
- `components/ProductCardSkeleton.tsx` (new)
- `index.css` (skeleton + polish styles)
- `data/store.config.ts` (added copy.ui.toastBuildUpdated)

## Non-goals
- No new features, no dashboard, no backend.
- No changes to ordering logic (WhatsApp/Messenger).
- No changes to your catalog schema.

## Quick test checklist
1) `npm run dev -- --host`
2) Open on Android:
   - Product images appear with a brief shimmer then fade in.
3) Deploy and bump `public/build.json` version:
   - Site reloads once on the next visit.
