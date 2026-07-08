$ErrorActionPreference = "Stop"

$workspaceLayout = Join-Path $PSScriptRoot "..\app\(workspace)\layout.tsx"
if (-not (Test-Path $workspaceLayout)) {
  throw "Safety check failed: app/(workspace)/layout.tsx was not found. Cleanup aborted."
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$legacyRoutes = @(
  "about",
  "action-center",
  "activity",
  "correlation",
  "dashboard",
  "explorer",
  "insights",
  "notifications",
  "platform",
  "prediction",
  "risk-map",
  "settings"
)

Write-Host "StuntLytics route migration cleanup" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"

foreach ($route in $legacyRoutes) {
  $legacyPath = Join-Path $projectRoot "app\$route"
  if (Test-Path $legacyPath) {
    Remove-Item -Recurse -Force $legacyPath
    Write-Host "Removed legacy duplicate: app/$route" -ForegroundColor Yellow
  }
}

$nextPath = Join-Path $projectRoot ".next"
if (Test-Path $nextPath) {
  Remove-Item -Recurse -Force $nextPath
  Write-Host "Removed stale Next.js cache: .next" -ForegroundColor Yellow
}

Write-Host "\nCleanup complete. Validating routes..." -ForegroundColor Green
Push-Location $projectRoot
try {
  node scripts/validate-routes.mjs
} finally {
  Pop-Location
}

Write-Host "\nDone. Run: npm run dev" -ForegroundColor Green
