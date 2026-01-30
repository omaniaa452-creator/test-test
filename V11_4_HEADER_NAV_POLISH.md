# V11.4 — Header + Navigation Polish (Mobile-first)

This release improves navigation clarity and conversion on Android/mobile without adding a backend or dashboard.

## What changed
- Sticky header refined with a compact state on scroll.
- Mobile navigation uses the existing `SideDrawer` (hamburger menu).
- Nav links use smooth scrolling with header offset (no section hidden under the sticky header).
- Active section highlight (scroll-spy) for both desktop nav and drawer.
- Floating quick CTA appears after scrolling (uses `STORE_CONFIG.messages.generalLead()` and preferred channel).

## Where to customize
- Header / nav labels come from: `data/sections.config.ts` (enabled nav items)
- Quick CTA label: `data/store.config.ts` → `copy.primaryCtaLabel`
- General lead message: `data/store.config.ts` → `messages.generalLead()`

## Quick QA checklist
1. `npm run build` succeeds.
2. On mobile width:
   - hamburger toggles drawer
   - drawer links scroll correctly and close the drawer
3. On desktop:
   - top nav visible, active section underline updates while scrolling
4. Floating CTA:
   - appears after scrolling down
   - opens preferred channel (WhatsApp/Messenger)
