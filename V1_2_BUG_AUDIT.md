# v1.2 Bug Audit & Fixes (Category Pages)

This release focuses on correctness and predictable navigation behavior for **category pages via full reload**.

## Fixes included
1) **Empty `?cat=` cleanup**
- If the URL contains the category param but the value is empty (e.g. `/?cat=`), it is removed automatically using `history.replaceState` to keep share links clean.

2) **Hash-less reload navigation**
- When switching categories in `reload` mode, the URL hash is cleared to prevent any in-page anchor scrolling. The category switch behaves like a real page change.

3) **Whitelist + sanitization**
- Only known category IDs are allowed. Unknown values are removed from the URL.
- Input is normalized with `trim().toLowerCase()`.

## Audit checklist performed (static + logic review)
- ✅ No duplicate exported symbols (e.g., `CloseIcon`) in `components/Icons.tsx`.
- ✅ `buildCatalogView` is imported and used correctly in `index.tsx`.
- ✅ Category filtering uses normalization to avoid common data issues (trailing spaces, different casing).
- ✅ Reload navigation keeps other query params (e.g., `preset`) intact.

## Known constraints (Termux / Android)
- npm installs **must be executed from Termux HOME** (`/data/data/com.termux/files/home/...`), not from shared storage (`/storage/emulated/0/...`), because Android shared storage blocks symlinks required by `node_modules/.bin`.

## Suggested Gate Check (run locally)
```bash
npm install
npm run build
npm run preview -- --host
```

## Manual tests
- Open `/?cat=phones`, `/?cat=laptops`, `/?cat=watches`, `/?cat=accessories`
- Click category menus and verify **full reload** (no in-page scroll)
- Verify invalid `/?cat=unknown` falls back to `all` and cleans the URL
- Verify `/?cat=` is cleaned to `/`
