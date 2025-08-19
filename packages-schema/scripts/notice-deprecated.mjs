#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const pkgJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const pkgName = pkgJson?.name || '此包';

const reset = '\u001B[0m';
const yellow = '\u001B[33m';
const red = '\u001B[31m';
const bold = '\u001B[1m';

const lines = [
  '',
  `${bold}${red}⚠ 弃用通知${reset}`,
  `${yellow}${pkgName}${reset} 已标记为废弃，后续不再维护与更新。`,
  '请迁移至替代方案（详见本包 README），或在仓库中查看迁移指南。',
  '',
];

try {
  console.warn(lines.join('\n'));
} catch {}
