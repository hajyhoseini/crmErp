import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const nodeVersion = process.version;
const npmVersionResult = spawnSync('npm', ['--version'], { shell: true, encoding: 'utf-8' });
const npmVersion = npmVersionResult.stdout ? npmVersionResult.stdout.trim() : 'unknown';
console.log(`Node: ${nodeVersion}, npm: ${npmVersion}`);

const nodeModulesPath = path.join(rootDir, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  try {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  } catch {}
  if (fs.existsSync(nodeModulesPath)) {
    console.error('حذف node_modules انجام نشد. لطفاً تمام ترمینال‌ها و VS Code را ببندید، همگام‌سازی OneDrive را متوقف کنید و مجدداً تلاش نمایید.');
    process.exit(1);
  }
}

spawnSync('npm', ['cache', 'clean', '--force'], { shell: true, stdio: 'inherit' });

const installResult = spawnSync(
  'npm',
  ['install', '--no-audit', '--no-fund', '--fetch-retries=5', '--fetch-retry-mintimeout=20000', '--fetch-retry-maxtimeout=120000'],
  { shell: true, stdio: 'inherit' }
);

if (installResult.status !== 0) {
  console.error('نصب ناموفق بود. اتصال شبکه یا VPN را بررسی کنید و دوباره اجرا کنید.');
  process.exit(1);
}

console.log('نصب کامل شد. npm run dev را اجرا کنید.');
process.exit(0);
