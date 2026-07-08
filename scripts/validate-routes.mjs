import fs from 'node:fs';
import path from 'node:path';

const appDir = path.resolve(process.cwd(), 'app');
const PAGE_RE = /^page\.(?:js|jsx|ts|tsx|mjs|cjs)$/;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (PAGE_RE.test(entry.name)) files.push(full);
  }
  return files;
}

function routeFromPage(file) {
  const relDir = path.relative(appDir, path.dirname(file));
  const segments = relDir === '' ? [] : relDir.split(path.sep);
  const urlSegments = segments.filter((segment) => {
    // Route groups do not contribute to the URL path.
    if (segment.startsWith('(') && segment.endsWith(')')) return false;
    // Parallel-route slots do not contribute to the URL path.
    if (segment.startsWith('@')) return false;
    return true;
  });
  return '/' + urlSegments.join('/');
}

if (!fs.existsSync(appDir)) {
  console.error('Route validation failed: app/ directory was not found.');
  process.exit(1);
}

const pages = walk(appDir);
const routes = new Map();
for (const page of pages) {
  const route = routeFromPage(page);
  const list = routes.get(route) ?? [];
  list.push(path.relative(process.cwd(), page));
  routes.set(route, list);
}

const conflicts = [...routes.entries()].filter(([, files]) => files.length > 1);
if (conflicts.length > 0) {
  console.error('\nDuplicate App Router paths detected:\n');
  for (const [route, files] of conflicts) {
    console.error(`  ${route}`);
    for (const file of files) console.error(`    - ${file}`);
  }
  console.error('\nFix: keep only one page.tsx for each URL. In this project, workspace pages belong under app/(workspace)/.');
  process.exit(1);
}

console.log(`Route validation passed: ${pages.length} pages, ${routes.size} unique URL paths.`);
