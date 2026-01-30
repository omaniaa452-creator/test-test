# V11.4 Bug Review (Header/Nav)

## Key risks checked
- Scroll-to-section offset with sticky header (prevents hidden section titles)
- Mobile drawer open/close state and body scroll locking (handled by existing `SideDrawer`)
- Active section calculation: uses enabled nav IDs and header height with a small buffer
- Quick CTA: uses `STORE_CONFIG.messages.generalLead()` and preferred channel

## Known behavior
- Active section uses simple `offsetTop` comparison; if two sections are very close, the highlight may switch slightly earlier/later. This is acceptable and does not affect functionality.

## Manual test checklist
- Desktop: nav links smooth-scroll and active underline updates on scroll
- Mobile: hamburger opens drawer, tapping a link closes drawer and scrolls correctly
- Quick CTA appears after scrolling and opens the preferred channel
