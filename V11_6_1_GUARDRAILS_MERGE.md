# V11.6.1 (Nav + Catalog + Guardrails)

This release **keeps all V11.6 features** and re-adds the missing **V11.5 guardrails** so the UI doesn't break when clients provide imperfect content.

## Included
- V11.6: `nav` controls (enable/disable header, hamburger, desktop links, quick CTA)
- V11.6: `catalogMenus` (tabs/lists based on categories or explicit product IDs)
- V11.5: Guardrails:
  - Safe image fallback to `/assets/placeholder-product.svg`
  - Badge clamping (default 3)
  - Line clamping for long titles / descriptions (configurable)
  - Long-word wrapping to avoid layout breaks

## Config keys (data/store.config.ts)
Under `copy.ui`:
- `maxTitleLines`
- `maxDescriptionLines`
- `badgesClamp`
- `priceFallbackText`
- `clampLongWords`
- `placeholderProductImage`

## Notes
- `npm run build` should succeed on Node 18+.
- For Termux, prefer Node 20 LTS if possible.
