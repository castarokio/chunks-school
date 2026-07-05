import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const standaloneDir = path.join(root, '.next', 'standalone');

if (!existsSync(standaloneDir)) {
  process.exit(0);
}

await mkdir(path.join(standaloneDir, '.next'), { recursive: true });

const copies = [
  [path.join(root, '.next', 'static'), path.join(standaloneDir, '.next', 'static')],
  [path.join(root, 'public'), path.join(standaloneDir, 'public')],
];

for (const [from, to] of copies) {
  if (existsSync(from)) {
    await cp(from, to, { recursive: true, force: true });
  }
}
