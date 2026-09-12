---
target: index.html card-stack hero component
total_score: 16
max_score: 28
na_heuristics: 5,9,10
p0_count: 2
p1_count: 3
timestamp: 2026-09-11T20-50-06Z
slug: index-html-card-stack
---
Method: dual-agent (Assessment A: design review · Assessment B: detector + browser evidence)

## Design Health Score (scoped to the card-stack component only — several heuristics are n/a for a decorative browse widget, not a task flow)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Dots show position, but hover-edge feedback is too subtle to register |
| 2 | Match System / Real World | 3 | Real destination names/photos, familiar "card stack" metaphor |
| 3 | User Control and Freedom | 3 | Drag, click-any-side-card, dots, and arrow keys all work — genuinely multiple exits |
| 4 | Consistency and Standards | 2 | 18px radius breaks the site's 4px/2px radius language with no visual signal it's deliberate |
| 5 | Error Prevention | n/a | No destructive/error-prone actions in a browse widget |
| 6 | Recognition Rather Than Recall | 1 | No visible drag affordance; dots unlabeled for sighted users; side-card-is-clickable is undiscoverable |
| 7 | Flexibility and Efficiency | 3 | Four independent input paths (drag, click, dots, keyboard) is unusually flexible for this kind of widget |
| 8 | Aesthetic and Minimalist Design | 2 | Clean photo-card look undercut by 8px eyebrow text that's borderline illegible |
| 9 | Error Recovery | n/a | No error states possible |
| 10 | Help and Documentation | n/a | Persuade-surface decorative widget, no help needed |
| **Total** | | **16/28** | **Acceptable (57%)** |

## Design Specificity Verdict

**LLM assessment:** Mixed, leaning generic. The implementation's own code comment in assets/js/main.js (lines 57-59) says it was "ported from a React/framer-motion component the user sourced elsewhere — same signed-offset fan math and drag-to-cycle behavior." That's a template pattern by its own admission — the interaction shape (signed-offset fan, drag-velocity threshold) is the same math found in dozens of generic "stacked card carousel" tutorials, tuned to nothing specific about Finnish wilderness lodging. What is specific: real destination photography, eyebrow/title pairing matching the site's existing gallery-card and property-card idiom, oklch color tokens, and a scrim gradient consistent with the "Forest Noir" mood. The shell is stock; the skin is bespoke. Dropped into a generic travel template with different photos, it would look at home unchanged.

**Deterministic scan:** detect.mjs --json index.html exited 0 with an empty findings array, but self-reported running DEGRADED — the HTML parser dependencies (htmlparser2, css-select, css-tree, domutils) aren't installed in this environment, so the empty result is not a clean bill of health, just an undercount. The browser-injected overlay (which doesn't depend on those packages) did run successfully and found 14 anti-patterns; the ones that land on the card-stack specifically are undersized-ui-text hits on all 8 destination eyebrow labels (HELSINKI x2, JYVASKYLA, OULU, TURKU, ROVANIEMI, LEVI, INARI) rendered at 8px — verified against the markup, not a false positive. The remaining findings (wide-tracking, hero eyebrow chip, nav text) belong to other parts of the hero/nav, out of scope for this component.

**Visual evidence:** at 1280x800, the stack sits low in the hero's right side, overlapping the mountain photo. Corner radius reads as generously rounded (~16-20px), a thin border differentiates each card from the photo behind it, and a dark scrim holds the eyebrow/title text at the bottom of each card. The overlap between the front card and the ones peeking behind is tight — a compact "deck" look rather than a wide fan, which matches the intended "curve the edges" stacked-card brief. Proportionally, though, the whole component reads smaller and lower-contrast than the headline on the left — a secondary decorative element, not a co-equal visual anchor.

## Overall Impression

The spec was followed literally — corners are curved, borders are crisp (2px, not a blur), and there is a real hover effect scoped to just the border/edge — but two things undercut it: the whole interaction has zero discoverable affordance (nothing signals "drag me" or "click that card behind"), and the destination labels are small enough that the automated detector flagged all eight of them. The bigger structural note is that the component is an off-the-shelf interaction pattern with FNAB's skin on it, which is exactly the "AI slop" risk you asked about — not because it looks bad, but because nothing about how it moves is specific to this product.

## What's Working

- Real photography + eyebrow/title labeling matches the visual language already established by .gallery-card and .property-card elsewhere on the site — this component doesn't feel like a foreign transplant content-wise.
- prefers-reduced-motion is handled by collapsing the transition duration rather than disabling the layout entirely — cards still fan out correctly, they just don't animate. That's the right call and easy to get wrong.
- The drag-to-cycle physics use a real velocity threshold, not just a distance check — considered, not default.

## Priority Issues

- **[P0] No visible interaction affordance.** Nothing on-screen hints that the stack is draggable or that the two peeking side cards are themselves clickable. A first-time visitor is likely to treat it as static decoration. **Fix:** add a subtle drag-cursor style plus a one-time gentle nudge animation on load (a few px side-to-side), and consider small prev/next chevrons for non-touch, non-obvious-drag users. **Suggested command:** /impeccable onboard or /impeccable delight.
- **[P0] No visible keyboard focus indicator.** .card-stack sets outline: none with no replacement focus style, so a keyboard user tabbing to the widget gets no feedback it's focused before pressing arrow keys. **Fix:** add a visible :focus-visible ring on #card-stack. **Suggested command:** /impeccable audit.
- **[P1] Destination labels are illegible at 8px.** Confirmed by the detector across all 8 cards (HELSINKI, JYVASKYLA, OULU, TURKU, ROVANIEMI, LEVI, INARI). **Fix:** raise .stack-card__eyebrow to at least 9-10px, matching the 11px floor already used elsewhere on primary content per the site's earlier type-scale decision. **Suggested command:** /impeccable typeset.
- **[P1] Hover-edge effect is too subtle to register as intentional.** The 1-2px border/ring change is close to imperceptible at normal viewing distance, undermining the explicit "hover effect at the edges" ask. **Fix:** widen the contrast delta or pair it with a small lift/scale so the edge change is legible without becoming a full-card glow. **Suggested command:** /impeccable polish.
- **[P1] Reads as a ported widget, not an authored one.** Confirmed directly by the implementation's own code comment. The fan math, spacing ratio, and easing are all stock values with nothing tuned to this product. **Fix:** adjust the offset/rotation constants and/or add one small brand-specific detail (e.g. a compass-tick mark or aurora-tinted ring on the active card) so the motion itself carries product identity, not just the photos inside it. **Suggested command:** /impeccable delight.
- **[P2] Dots have no visible label for sighted users.** Only aria-label exists; a sighted visitor sees 8 identical unlabeled dots. **Fix:** show the destination name in a small tooltip on dot hover/focus. **Suggested command:** /impeccable clarify.
- **[P3] Active-card hover vs. click ambiguity.** Hovering the active card shows the same "explore" edge cue as a look-closer gesture, but clicking immediately navigates away with no distinguishing state. **Fix:** surface a small "View stay" label on hover to disambiguate look vs. go. **Suggested command:** /impeccable clarify.

## Persona Red Flags

**Jordan (First-Timer):** On mobile the stack sits below the full search form and needs a scroll to reach; once visible, nothing hints it's draggable, and the tiny 8px labels make it read as background art rather than a real navigation option. Likely to scroll past without ever discovering it books a destination.

**Sam (Accessibility-Dependent):** Can technically operate every path (arrow keys work, click works), but gets zero visible focus feedback and 8 unlabeled dots — functionally accessible, perceptually invisible. A low-vision user relying on visible focus rings specifically will lose track of where they are entirely.

## Minor Observations

- The 18px radius is a deliberate, documented exception to the site's 4px/2px radius language — but nothing in the UI itself signals that to a viewer; it can read as inconsistency rather than intent unless the rest of the fixes above make the component feel obviously "designed," not just "different."
- detect.mjs's CLI pass ran degraded (missing parser deps) in this environment — worth noting for future audits on this project, since an empty findings array from it should not be read as a clean pass.

## Questions to Consider

- What if the drag affordance were taught in the first 2 seconds (a tiny automatic nudge) instead of left to be discovered by accident?
- Does the component need its own distinct "personality" in its motion, or is matching the photos' mood (aurora, forest, ice) enough once the labels and focus states are fixed?
