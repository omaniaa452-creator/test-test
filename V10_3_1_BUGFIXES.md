# V10.3.1 Bugfix Pack

This patch fixes build/runtime risks found during a strict audit of V10.3.

## Changes

1. **index.tsx**: Added missing import for `buildCatalogView`.
2. **utils.ts**: Made `checkForBuildUpdate()` respect `import.meta.env.BASE_URL` so it works in subpaths and relative hosting.
3. **data/catalog.control.ts**: Stock detection now respects `isSoldOut === true` (CSV import schema) in addition to `inStock === false`.
4. **components/GalleryModal.tsx**: Preserved `search` and `hash` when pushing history state (keeps `?preset=...` and anchors).
5. **index.tsx**: Videos section now filters to entries that have a real `src` to avoid broken cards.
6. **data/presets.ts**: Fixed syntax and normalized `catalogControl` blocks inside presets.
7. **order.ts**: Widened grid column type to avoid TypeScript union assignment errors.

## Verification

- `npm run build` succeeds.
