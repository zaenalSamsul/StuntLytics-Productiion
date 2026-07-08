# StuntLytics — Medical Workspace Layout Rework

## Goal
Rework the latest award-ready StuntLytics frontend into a consistent, useful, health-focused product experience. The visual hierarchy borrows dashboard composition principles from premium admin products without cloning a specific template.

## Major changes

### 1. One workspace shell
- All operational pages share a single `(workspace)` layout.
- Consistent 258px sidebar, sticky topbar, max-width content canvas, spacing, footer, dark mode, and responsive mobile drawer.
- Nested dashboard routes now resolve the correct page title.

### 2. New StuntLytics identity
- Custom growth-trajectory + medical-cross vector mark.
- New `BrandLogo` component and SVG app icon assets.
- Blue/teal clinical palette, slate hierarchy, controlled gradients, reduced "AI template" aesthetics.

### 3. Landing page rebuilt
- Split hero with real product preview.
- Program workflow: Monitor → Review → Act → Verify.
- Capability sections, multidisciplinary team section, evidence-oriented messaging, richer CTA composition.

### 4. Main dashboard rebuilt
- Clinical command hero.
- KPI cards and regional risk hierarchy.
- Trend chart, regional risk distribution, priority region table, intervention completion chart.
- Links into risk map, action center, analytics, and explorer.

### 5. Functional interactions
- Notification center with persistent read state.
- Ctrl/Cmd+K command palette.
- Light/dark appearance persistence.
- Help and profile menus.
- Settings persistence.
- Working CSV exports in Explorer, Activity, Analytics, and Factor Review.
- Functional analytics filters.
- Action Center case drawer, acknowledgement, and scenario calculation.
- Dashboard regional row feedback.
- Toast feedback system.

### 6. Health content consistency
- Removed out-of-scope Kulon Progo sample from West Java workspace.
- Data Explorer uses West Java context.
- Health Insights language reduced generic AI branding.
- Metadata reframed around child health, monitoring, and accountable follow-up.

### 7. Family Screening Support rebuilt
- Removed constant 68% dummy result.
- Inputs now influence a transparent weighted demo score.
- Required-field and age validation.
- Contributing signals and verification actions.
- Explicit non-diagnostic boundary.

### 8. Factor & Trend Review rebuilt
- Correlation/causality wording corrected.
- Direction vs magnitude toggle.
- CSV factor export.
- Field-review questions instead of unsupported causal recommendations.

### 9. Spatial intelligence retained
- Interactive MapLibre map.
- West Java boundary layer.
- Risk, heat, and directional risk-signal flow views.
- Observed/projected scenario controls and timeline.
- Risk-flow semantics explicitly avoid representing stunting as infectious transmission.

## Validation

- `npx tsc --noEmit --pretty false` → PASS
- `npm run build` → PASS
- Static prerender → 18/18 routes
- Production HTTP smoke test:
  - `/` → 200
  - `/dashboard` → 200
  - `/correlation` → 200
  - `/prediction` → 200
  - `/risk-map` → 200
  - `/action-center` → 200
  - `/explorer` → 200
  - `/settings` → 200
- `package-lock.json` internal registry references → 0

## Important boundary
The application is a decision-support and program-monitoring frontend. Screening, analytical associations, scenarios, and insights must not be presented as a substitute for clinical diagnosis, validated epidemiological inference, or qualified health-program judgement.
