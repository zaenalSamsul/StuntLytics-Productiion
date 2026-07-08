# Doctor Hero Implementation

Landing page hero visual has been updated to use the new professional doctor composition.

## Asset

- `public/images/stuntlytics-doctor-hero.png`

## Integration

- Replaces the previous cartoon/vector `GrowthCareIllustration` in `app/page.tsx`.
- Uses `next/image` with responsive `sizes`, `priority`, `fill`, and cover positioning.
- The full visual remains interactive and links to `/risk-map`.
- Duplicate floating cards were removed because the new visual already contains the monitoring cards.
- A subtle responsive hover scale and lower gradient are applied without obscuring the healthcare visual.

## Validation

- Route validation: 16 pages / 16 unique URL paths
- TypeScript: PASS
- Next.js production build: PASS, 18/18 static routes
