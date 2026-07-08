# StuntLytics — Frontend Redesign Audit

## Scope

Redesign applied to the existing Next.js frontend using **Modern Minimalism + Blue Mint Clinical Premium**, while retaining current routes, API services, SWR hooks, prediction logic, backend communication, and data structures.

## Existing Frontend Audit

### Findings

1. **Visual tokens were inconsistent**
   - `app/globals.css` used bright cyan/teal tokens.
   - `lib/colors.ts` used a separate blue/pink/dark palette.
   - Several pages used hardcoded risk colors and Tailwind defaults.

2. **Application shell was fragmented**
   - `/dashboard/*` had its own layout.
   - Other analysis routes used `MainLayout`.
   - `Sidebar` props did not match `app/dashboard/layout.tsx`.
   - No consistent top navigation existed.

3. **Information hierarchy was generic**
   - Dashboard used equal-size card grids.
   - No clinical priority hierarchy, contextual hero, AI safety note, or bento layout.

4. **Accessibility gaps**
   - Header icons used emoji.
   - Status meaning was often encoded primarily by color.
   - Mobile navigation controls lacked a unified shell.
   - Reduced-motion behavior was not defined globally.

5. **Component inconsistencies**
   - Legacy classes such as `text-text-secondary` had no stable shared token mapping.
   - Card radii, focus rings, chart surfaces, and table styles varied by page.

6. **Dependency conflict resolved**
   - The existing graph resolved `@base-ui/react` with a peer expectation for `date-fns` v4 while the project declared v3.
   - `date-fns` was aligned to a v4-compatible range so a normal `npm install` succeeds without legacy peer flags.

## Implemented Changes

### Design foundation

- Added Blue Mint Clinical Premium tokens:
  - Primary blue `#2563EB`
  - Health mint `#14B8A6`
  - Deep slate text `#0F172A`
  - Clinical background `#F7FAFC`
  - Soft blue and mint surfaces
  - Semantic success, warning, danger, and info colors
- Added dark clinical palette without absolute black.
- Added soft shadow system and 8–24 px radius scale.
- Added consistent text aliases for legacy pages.
- Added reduced-motion support.
- Added visible focus behavior and 44 px interactive targets in the app shell.

### Application shell

- Unified sidebar behavior and props.
- Added grouped navigation hierarchy.
- Added mobile drawer overlay.
- Added sticky topbar with search, notification, security status, and profile affordance.
- Standardized content width and responsive page padding.
- Unified `/dashboard/*` with the same `MainLayout` used across analysis routes.

### Dashboard

- Replaced generic equal-card layout with responsive bento composition.
- Added compact contextual hero.
- Added metric cards with trend context.
- Added accessible status badges with icon + text.
- Added responsive health trend visualization.
- Added AI insight card with confidence and non-diagnostic disclaimer.
- Added priority area monitoring and quick actions.

### Reusable components

- `Topbar`
- `StatusBadge`
- `EmptyState`
- `Skeleton` / `MetricCardSkeleton`
- Redesigned `MetricCard`
- Redesigned `PageHeader`
- Redesigned `Alert`
- Redesigned `FilterSummary`
- Redesigned `ChartWrapper`

### Cross-page consistency

- Standardized card surfaces.
- Standardized form focus treatment.
- Replaced feature-page emoji headers with Lucide icons.
- Normalized legacy white surfaces to design-system cards.
- Improved chart palette and tooltip treatment.

## Preserved

- Existing route URLs
- `lib/api.ts`
- `lib/hooks.ts`
- SWR integration
- Axios backend client
- Prediction page state and calculations
- Existing mock/demo datasets
- Python/Streamlit backend code
- Elasticsearch utilities
- Model files and GeoJSON assets

## Validation

- TypeScript: `npx tsc --noEmit --pretty false` — passed.
- Production build: `NEXT_TELEMETRY_DISABLED=1 npx next build --turbopack` — passed.
- Static prerender: 14/14 pages generated successfully.
- HTTP smoke test after `next start`: `/`, `/dashboard`, `/risk-map`, `/insights`, and `/prediction` all returned HTTP 200.
- Large Python/ML/GIS assets are preserved and excluded only from Next.js server output tracing.
