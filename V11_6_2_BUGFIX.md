# V11.6.2 Bugfix + Stability

This is a **safe patch** on top of **V11.6.1** (Nav + Catalog Menus + Guardrails). No existing features were removed.

## Fix 1 — Gallery fallback (support‑critical)
**Problem:**
- If a product had no valid `images[]` and `image` was empty/invalid (common with CSV edits), opening the Gallery could show a broken/empty image.

**Fix:**
- Gallery now sanitizes sources (trims values and removes empty strings).
- If nothing valid exists, it falls back to:
  - `STORE_CONFIG.copy.ui.placeholderProductImage` (default: `/assets/placeholder-product.svg`).
- The gallery start index is clamped to a safe range.

## Fix 2 — Catalog Menus filtering (data robustness)
**Problem:**
- Category matching was strict. Small differences like trailing spaces or case changes could make a tab show empty products.

**Fix:**
- Category matching now normalizes both sides using `trim().toLowerCase()`.
- `productIds` are also trimmed before comparison.

## Fix 3 — Active menu fallback (config safety)
**Problem:**
- If `catalogMenus.defaultId` was invalid or an item id changed, the UI could end up with a non-existent active menu.

**Fix:**
- When catalog menus are enabled, the active menu id is validated and automatically falls back to:
  - `all` (if enabled), otherwise the first available menu id.

## Fix 4 — Scroll listener stability (performance)
**Problem:**
- The scroll effect previously depended on `activeSectionId` which could cause repeated re-attachment of the scroll listener.

**Fix:**
- The scroll listener is now stable and uses a ref for the currently active section id.

---

## Quick smoke test
- `npm run build`
- `npm run preview -- --host`
- Test:
  - Open a product with missing image → open Gallery → should show placeholder.
  - Switch catalog tabs with categories that include extra spaces → filtering still works.
  - Scroll long pages → header compact + active section highlight remains smooth.
