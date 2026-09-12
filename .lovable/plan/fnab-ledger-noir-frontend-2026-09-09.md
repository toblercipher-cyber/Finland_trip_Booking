# FNAB Ledger Noir Frontend

## Goal
Build a polished, frontend-only booking journey for Finland Northern Areas Booking using the selected Ledger Noir direction: cinematic Finnish nature imagery, the Forest Noir palette, Orbitron typography, glass-layered controls, and restrained motion.

## Views and flow
1. **Landing (`/`)**
   - Full-viewport Finnish forest and aurora scene with FNAB navigation and the “Glass over the black pine.” headline.
   - Functional check-in, check-out, and guest controls in a floating glass search bar.
   - “Search” carries the mock search into property selection.

2. **Property selection (`/properties`)**
   - Three image-led accommodations matching the selected direction: Aurora Glass Igloo, Black Spruce Cabin, and Timber Hideaway.
   - Show accommodation type, capacity, feature, and nightly price.
   - Selecting a property visibly updates the active choice and advances to checkout.

3. **Booking details (`/checkout`)**
   - Responsive first name, last name, email, and phone form.
   - Stay summary reflects the selected mock property, dates, guests, nights, and calculated total.
   - Confirm action is mocked; no data is stored or sent.

## Unavailable-date state
- Treat a defined mock date range as unavailable so the state can be reproduced reliably.
- On confirmation with those dates, open an accessible red-accent modal containing the exact requested message:
  > Booking Unavailable: You cannot enter any further because there are no reasonable slots available in our system for these dates.
- Disable confirmation while the conflict is active.
- “Choose different dates” returns the user to date selection; changing to an available range clears the conflict and re-enables confirmation.

## Visual system
- Use the locked colors: ink `#080B09`, pine `#172019`, mist `#DCE8DC`, bone `#F2F0E9`, plus a restrained red error accent.
- Load Orbitron correctly through the document head and use careful weight, scale, and spacing for readability.
- Carry over the selected compact radii, thin borders, translucent dark layers, large editorial headline, and full-width photographic composition.
- Generate and use a cohesive set of original Finnish wilderness, glass-igloo, and timber-cabin images based on the selected direction’s prompts; the uploaded image remains the visual reference.
- Adapt grids, controls, summaries, and modal placement for mobile, tablet, and desktop without changing the chosen composition.

## Motion and interaction
- Add Motion for React for slow image depth shifts, scroll-linked section reveals, measured text entrances, and subtle property-selection feedback.
- Keep movement restrained and cinematic, with reduced-motion fallbacks.
- Provide clear focus, validation, selected, disabled, modal, and mock-success states.

## Technical details
- Implement with TanStack Start, React 19, Tailwind CSS v4 semantic tokens, and Motion for React.
- Keep shared booking choices in frontend state only; initialize sensible mock defaults when a route is opened directly.
- Add route-specific title, description, Open Graph, and Twitter metadata for all three views.
- Verify navigation, form behavior, conflict recovery, keyboard/modal behavior, console health, and desktop/mobile rendering in the running preview.

## Out of scope
- No database, authentication, payments, availability service, or real email submission.
