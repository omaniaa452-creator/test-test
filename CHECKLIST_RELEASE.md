# Release Checklist (Before you deliver)

## Build
- [ ] `npm run build` passes
- [ ] `npm run preview -- --host` opens on phone

## Mobile UX (Android)
- [ ] Home loads fast (no white screen)
- [ ] Product grid looks correct (1/2 cols as configured)
- [ ] Product Sheet opens/closes normally
- [ ] Swipe-down works only from handle/header
- [ ] Images load with skeleton and fade-in

## Ordering
- [ ] WhatsApp opens correct number
- [ ] Message content is clear (name + price + optional notes)
- [ ] Messenger fallback works (copy text shown if needed)

## Catalog logic
- [ ] `hiddenIds` hides products everywhere
- [ ] Featured products do not duplicate in main list
- [ ] Manual order works
- [ ] Empty catalog state is readable

## Content
- [ ] All section titles match the client’s niche
- [ ] Trust bullets are realistic and true
- [ ] No placeholder phone numbers or links

## Deliverables
- [ ] Client link
- [ ] 3 screenshots (home, product sheet, order)
- [ ] Short instructions (handover)
