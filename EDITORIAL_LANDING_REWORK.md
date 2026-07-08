# StuntLytics Editorial Healthcare Landing Rework

## Direction

Landing page was rebuilt using the supplied visual reference as a structural and art-direction cue, without copying its brand, content, or exact composition.

Key adopted principles:
- editorial healthcare composition rather than generic SaaS hero;
- oversized lightweight typography;
- a dominant clinical visual focal point;
- floating health/data cards;
- generous whitespace;
- asymmetric long-form sections;
- restrained blue–mint clinical palette;
- dark rounded CTA treatments;
- human-review and governance messaging;
- product actions connected to real routes.

## New hero

- Large editorial headline.
- Custom StuntLytics clinical SVG illustration.
- Floating cards for growth review, regional signal, priority areas, and follow-up verification.
- Functional workspace search.
- Live program-view label.
- Direct regional-map CTA.
- Three operational proof points.

## Functional hero search routes

- map / wilayah / regional / risk -> `/risk-map`
- action / intervensi / follow -> `/action-center`
- data / explore / record -> `/explorer`
- factor / korelasi / determinant -> `/correlation`
- screen / family / keluarga -> `/prediction`
- notif / alert -> `/notifications`
- audit / activity -> `/activity`
- fallback -> `/dashboard`

## New sections

1. Trust ribbon for growth context, accountable action, and verification.
2. About StuntLytics with asymmetric monitoring visualization.
3. Trusted child-health workspace capability cards.
4. Multidisciplinary program coordination section.
5. Signal-to-verified-action workflow.
6. Governance-by-design network.
7. Final clinical teal CTA block.

## Validation

- `npx tsc --noEmit --pretty false` -> PASS
- `npm run build` -> PASS
- static generation -> 18/18 routes
- smoke tests -> HTTP 200 for `/`, `/dashboard`, `/risk-map`, `/action-center`, `/explorer`, `/platform`
- package-lock internal registry references -> 0
