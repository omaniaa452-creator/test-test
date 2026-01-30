# test-v1 – Fixes Applied

## Renaming
- Root folder renamed to `test-v1`.
- `package.json` name set to `test-v1` and version set to `1.0.0`.
- `public/build.json` version set to `1.0.0` (if present).

## Critical bug fix (Product Card / Product Sheet)
### Problem
Clicks on buttons inside a product card (View Details / Quick Order) were bubbling to the card container click handler.
This could:
- open the product sheet unintentionally when trying to place an order
- trigger duplicate open/analytics events

### Fix
- Added `e.stopPropagation()` wrappers to:
  - the “View Details” button
  - the optional quick order buttons (primary + secondary channel)

## Notes
- No features were removed.
- This is a behavior hardening for mobile users.
