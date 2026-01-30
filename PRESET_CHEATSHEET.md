# Preset Cheatsheet (V11.1)

This template supports **Presets** to retarget the SAME storefront to different niches **without editing React components**.

## How to activate a preset
1) Open `data/store.config.ts`
2) Set:
   - `activePresetId: "<preset-id>"`

> You can also keep multiple presets and switch per client.

## Available presets

| Preset ID | Best for | Mobile layout | Sorting | Notes |
|---|---|---:|---|---|
| `bridal_luxury` | Bridal / luxury tailoring | 1 col | Default | Premium, slower browsing, high trust |
| `fashion_modern` | Fashion / clothes | 2 cols | Featured-first | Fast browsing + featured items |
| `home_decor` | Home decor / furniture | 2 cols | In-stock-first | Clean spacing, bigger visuals |
| `services_minimal` | Services / appointments | List (1 col) | Manual | Best for “service cards” |
| `perfume_minimal` | Perfume / cosmetics | 2 cols | Featured-first | Compact grid, square images |
| `restaurant_menu` | Restaurant / café menu | List (1 col) | Manual | Menu style, 16:9 images |
| `electronics_deals` | Electronics / deals | 2 cols | In-stock-first | Specs-first, image contain |
| `beauty_salon` | Beauty salon / booking | List (1 col) | Manual | Booking-friendly copy |
| `handmade_artisan` | Handmade / artisan | 1 col | Featured-first | Story + trust positioning |

## Safe customization tips
- If you change a preset:
  - Only edit `copy`, `theme`, `layout`, and `catalogControl` keys.
- Don’t delete keys; keep defaults and override what you need.
- If a product image is missing, the UI will fallback to the first `images[]` item or a placeholder.

## Quick workflow (per client)
1) Pick closest preset
2) Update brand name + top bar + hero text
3) Add/replace products (up to 12 for your starter offer)
4) Set featured IDs (optional)
5) Test WhatsApp/Messenger on Android
