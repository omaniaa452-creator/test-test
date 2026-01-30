> Updated for v1.2 (hash-less reload + empty cat cleanup + audit)

# Category Pages Mode (Reload Navigation)

This template supports two ways to switch catalog categories:

1. **Filter in-place** (single-page tabs)  
2. **Reload category pages** (URL-based, shareable links)

## How it works
When `catalogMenus.navigationMode` is set to `reload`, clicking a category updates the URL query parameter (default `cat`) and **reloads** the page:

- All products: `/`
- Phones: `/?cat=phones`
- Laptops: `/?cat=laptops`

The UI remains the same; only the visible products change.

## Config
Edit: `data/store.config.ts`

```ts
catalogMenus: {
  enabled: true,
  showAll: true,
  allLabel: 'الكل',
  defaultId: 'all',

  // NEW:
  navigationMode: 'reload', // or 'filter'
  paramName: 'cat',

  items: [
    { id: 'phones', label: 'هواتف', categories: ['هواتف'] },
    { id: 'laptops', label: 'لابتوبات', categories: ['لابتوبات'] },
  ],
}
```

## Safety rules
- Only known category IDs are accepted (whitelist).
- Unknown `?cat=` values are ignored and cleaned from the URL.
- Title updates to `"{Category} | {Brand}"` for share-friendly links.

## Notes
- Reload navigation is recommended when you want *separate pages* per category with the same design.
- Filter mode is recommended when you want a fast single-page tab experience.

## Notes & Hardening
- Empty `?cat=` values are automatically removed from the URL to keep share links clean.
- In reload mode, the template clears any `#hash` before navigation so the page never auto-scrolls.
- Unknown categories are sanitized back to `all` (or the first available menu) without crashing.
