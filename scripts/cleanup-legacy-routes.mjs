import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const workspaceLayout = path.join(root, 'app', '(workspace)', 'layout.tsx');

if (!fs.existsSync(workspaceLayout)) {
  console.error('Safety check failed: app/(workspace)/layout.tsx was not found. Cleanup aborted.');
  process.exit(1);
}

const legacyRoutes = [
  'about',
  'action-center',
  'activity',
  'correlation',
  'dashboard',
  'explorer',
  'insights',
  'notifications',
  'platform',
  'prediction',
  'risk-map',
  'settings',
];

console.log('StuntLytics route migration cleanup');
let removed = 0;
for (const route of legacyRoutes) {
  const legacyPath = path.join(root, 'app', route);
  if (fs.existsSync(legacyPath)) {
    fs.rmSync(legacyPath, { recursive: true, force: true });
    console.log(`Removed legacy duplicate: app/${route}`);
    removed += 1;
  }
}

const nextPath = path.join(root, '.next');
if (fs.existsSync(nextPath)) {
  fs.rmSync(nextPath, { recursive: true, force: true });
  console.log('Removed stale Next.js cache: .next');
}

console.log(`Cleanup complete. Removed ${removed} legacy route folder(s).`);
