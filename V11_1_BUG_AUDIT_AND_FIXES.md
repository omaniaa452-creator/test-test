# V11.1 Presets Pro — Bug Audit & Fixes

This is a **stability-focused** update on top of V11.1.

- ✅ Scope: **Bug audit + fixes**
- ❌ No new product features

---

## Fixed issues

### 1) Build blocker: invalid multi-line strings in presets
**Files:** `data/presets.ts`
- **Problem:** Some preset `heroTitle` values contained raw newlines inside single-quoted strings.
- **Result:** TypeScript failed with `TS1002: Unterminated string literal` and `npm run build` stopped.
- **Fix:** Replaced raw newlines with `\n` so the existing UI logic that splits on `\n` works.

### 2) Build blocker: missing `heroSrc` in ProductSheet
**File:** `components/ProductSheet.tsx`
- **Problem:** `heroSrc` was referenced but not defined.
- **Result:** TypeScript failed with `TS2304: Cannot find name 'heroSrc'`.
- **Fix:** Added a safe `heroSrc` computed value (memoized) that falls back to:
  1) `product.image`
  2) first valid `product.images[]`
  3) `${BASE_URL}assets/placeholder-product.svg`

### 3) Type safety: allow deep-partial catalog controls in presets
**File:** `data/presets.ts`
- **Problem:** `catalogControl` overrides in presets were intentionally partial (only `sorting/rules`) but the type required a full `CatalogControl` object.
- **Result:** TypeScript errors like: missing `hiddenIds`, `featured`, `manualOrderIds`.
- **Fix:** Updated `StorePreset.overrides` typing to allow `catalogControl` as a deep partial.

### 4) Version consistency
**File:** `package.json`
- **Problem:** Package version was still `11.0.0` while the build metadata was `11.1.0`.
- **Fix:** Set `package.json` version to `11.1.0`.

---

## Verification
- ✅ `npm ci`
- ✅ `npm run build`
- ✅ Vite production bundle built successfully.

