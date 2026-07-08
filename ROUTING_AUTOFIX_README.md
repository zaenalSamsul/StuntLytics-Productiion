# StuntLytics Routing Auto-Fix

This package automatically cleans legacy duplicate App Router folders before `npm run dev` and `npm run build`.

The canonical operational pages live under:

- `app/(workspace)/...`

Legacy duplicates that are automatically removed:

- `app/about`
- `app/action-center`
- `app/activity`
- `app/correlation`
- `app/dashboard`
- `app/explorer`
- `app/insights`
- `app/notifications`
- `app/platform`
- `app/prediction`
- `app/risk-map`
- `app/settings`

Commands:

```powershell
npm install
npm run dev
```

`predev` runs cleanup + route validation automatically.
