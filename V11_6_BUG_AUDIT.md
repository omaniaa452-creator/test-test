# V11.6 — Bug Audit Summary

Scope: navigation toggles + catalog menus (tabs) + regressions from V11.4 header/nav.

## Fixed / addressed
- **Header compact + active section highlight were not updating** (state existed but had no scroll listener).  
  Added a throttled `scroll` effect (requestAnimationFrame) that updates:
  - `isHeaderCompact`
  - `activeSectionId`
  - `showQuickCta` (config-controlled)

- **Quick CTA visibility** is now guarded by config (`nav.quickCta`) and only runs when navigation is enabled.

## New protections
- Catalog menus normalize inputs and ignore invalid items (empty id/label).
- Menu filter is applied safely:
  - Unknown menu id falls back to showing all products.
  - Supports `productIds` filter or `categories` filter (using `Product.category`).

## QA checklist (recommended)
1) `npm run build`
2) Mobile:
   - hamburger open/close (when enabled)
   - scroll-to-section offset correct
   - tabs switch product list
3) Desktop:
   - active nav link updates while scrolling

No breaking changes to order flow, product sheet, or gallery modal were introduced.
