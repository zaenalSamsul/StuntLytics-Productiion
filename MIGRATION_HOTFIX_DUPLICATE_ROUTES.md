# Hotfix: Duplicate App Router Paths

The workspace redesign moved operational pages from `app/<route>/page.tsx` into the route group `app/(workspace)/<route>/page.tsx` so they can share one workspace layout.

A Next.js route group such as `(workspace)` is omitted from the public URL. Therefore:

- `app/about/page.tsx` resolves to `/about`
- `app/(workspace)/about/page.tsx` also resolves to `/about`

Both cannot exist at the same time.

## Recommended fix

From the project root:

```powershell
npm run fix:routes
npm run dev
```

`fix:routes` performs a safety check, removes only the legacy duplicated operational route folders under `app/`, preserves `app/(workspace)/`, removes `.next`, and validates URL uniqueness.

## Alternative Windows PowerShell fix

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\cleanup-legacy-routes.ps1
npm run dev
```

## Manual fix

Delete these legacy folders if they still exist:

```text
app/about
app/action-center
app/activity
app/correlation
app/dashboard
app/explorer
app/insights
app/notifications
app/platform
app/prediction
app/risk-map
app/settings
```

Keep:

```text
app/(workspace)/...
app/page.tsx
app/layout.tsx
app/globals.css
```

Then remove `.next` and restart the dev server.
