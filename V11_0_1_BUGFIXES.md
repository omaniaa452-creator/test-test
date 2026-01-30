# V11.0.1 Bugfixes (Product Sheet)

This release fixes real-world interaction bugs found during QA on mobile devices.

## Fixed
1) Swipe-down close gesture no longer hijacks scrolling or button taps  
- The drag gesture is now **only** attached to the sheet handle/header area (`.sheet-drag-area`) instead of the whole sheet.

2) Touch cancel safety  
- Added `onTouchCancel` handling to reset dragging state cleanly.

3) Broken/missing hero image fallback  
- If `product.image` is missing/empty (common in CSV imports), the sheet now falls back to:
  - the first valid URL in `product.images`, else
  - a local placeholder: `public/assets/placeholder-product.svg`
- Added `onError` fallback to the same placeholder.

4) Gallery open spam protection  
- Added a short lock to prevent rapid double-taps from firing multiple open events.

## Files changed
- `components/ProductSheet.tsx`
- `index.css`
- `public/assets/placeholder-product.svg` (new)
