# StuntLytics — Award-Ready Product Upgrade

## Product narrative

The upgrade turns StuntLytics from a dashboard-oriented analytics UI into an operational decision-support platform with a traceable loop:

**Detect → Explain → Decide → Act → Verify**

## New capabilities

### 1. Priority Notification Center
- Persistent unread/read state in browser storage.
- Severity-aware alerts: critical, warning, insight, resolved.
- Categories for risk, AI, intervention, data, and system events.
- Quick actions to open relevant workflows.
- Full `/notifications` workspace with filtering and triage.

### 2. Early Warning & Action Center
- New `/action-center` route.
- Converts signals into interventions with case IDs.
- Priority, owner, status, deadline, progress, evidence, and verification states.
- Human-review safety guardrail.
- Illustrative scenario studio explicitly labelled as non-causal planning support.

### 3. Activity & Audit Trail
- New `/activity` route.
- Searchable event stream.
- Tracks analysis, data, alert, intervention, and system activity.
- Supports governance narrative and accountable decision-making.

### 4. Global Command Palette
- `Ctrl+K` / `Cmd+K` navigation.
- Search pages and high-value actions.
- Reduces navigation friction for expert users.

### 5. Realistic Regional Spatial Intelligence
- Interactive MapLibre GL map.
- GPU-rendered basemap and district overlays.
- 627 West Java subdistrict boundaries.
- Source boundary file simplified from ~32 MB to ~1.3 MB for frontend delivery.
- Choropleth risk layer.
- Heatmap hotspot layer.
- Curved directional risk-signal flows.
- Animated flow dash and hotspot pulse.
- Observed/projected scenario switch.
- Play/pause animation.
- Map navigation, scale, fullscreen, reset view.
- Clickable district and flow popups.
- API values override fallback values when available.
- Deterministic illustrative fallback is explicitly labelled.

### 6. Scientific interpretation guardrail
Stunting is not contagious. Flow lines are explicitly described as modelled movement/direction of:
- risk escalation signals,
- shared determinant pressure,
- referral/follow-up activity,
- intervention coordination.

They are **not** presented as person-to-person disease transmission.

### 7. Dashboard escalation strip
- Critical early-warning signal surfaced directly on the dashboard.
- One-click path to notifications or human triage in Action Center.

### 8. Landing page story update
- Repositioned features around spatial intelligence, action workflows, priority notifications, predictive screening, AI-assisted insights, and auditability.
- Removed unsupported compliance-style messaging.

## Key source files

- `components/RiskFlowMap.tsx`
- `components/NotificationCenter.tsx`
- `components/CommandPalette.tsx`
- `app/risk-map/page.tsx`
- `app/notifications/page.tsx`
- `app/action-center/page.tsx`
- `app/activity/page.tsx`
- `lib/riskFlows.ts`
- `lib/notifications.ts`
- `lib/interventions.ts`
- `lib/activity.ts`
- `public/data/jawa-barat-simplified.geojson`

## Validation completed

- `npx tsc --noEmit --pretty false` — PASS
- `npm run build` — PASS
- 17/17 static routes prerendered — PASS
- HTTP smoke tests — PASS:
  - `/dashboard` → 200
  - `/risk-map` → 200
  - `/notifications` → 200
  - `/action-center` → 200
  - `/activity` → 200

## Production integration notes

1. Replace illustrative flow definitions in `lib/riskFlows.ts` with validated longitudinal/spatial model outputs.
2. Connect notification records to backend/WebSocket/SSE infrastructure.
3. Persist intervention ownership and audit events in backend storage.
4. Configure a production-grade basemap/tile provider appropriate for expected traffic and its terms of service.
5. Keep AI insights reviewable and maintain explicit uncertainty/confidence cues.
