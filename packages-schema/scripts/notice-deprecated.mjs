#!/usr/bin/env node
/* eslint-disable unicorn/number-literal-case */
import { readFileSync } from 'node:fs';
import process from 'node:process';

// =============================
// 读取 package.json
// =============================
const pkgJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);
const pkgName = pkgJson?.name || '此包';

// 仓库与主页
let repoUrl = '';
if (pkgJson?.repository) {
  repoUrl =
    typeof pkgJson.repository === 'string'
      ? pkgJson.repository
      : pkgJson.repository.url || '';
  if (repoUrl.startsWith('git+')) repoUrl = repoUrl.slice(4);
  if (repoUrl.endsWith('.git')) repoUrl = repoUrl.slice(0, -4);
}
const homepageUrl = pkgJson?.homepage || '';

// =============================
// ANSI 样式
// =============================
const reset = '\u001B[0m';
const bold = '\u001B[1m';
const red = '\u001B[31m';
const yellow = '\u001B[33m';
const white = '\u001B[37m';
const bgRed = '\u001B[41m';

// =============================
// 内容构建
// =============================
const contentLines = [
  `${pkgName} 已标记为废弃，后续不再维护与更新。`,
  '请尽快迁移至替代方案：详见本包 README.md 或仓库迁移指南。',
  repoUrl && `仓库： ${repoUrl}`,
  homepageUrl && `主页： ${homepageUrl}`,
].filter(Boolean);

// =============================
// 字符宽度计算工具
// =============================
// eslint-disable-next-line no-control-regex
const ANSI_REGEX = /\u001B\[[0-9;]*m/g;

const isFullwidthCodePoint = (code) => {
  if (code < 0x11_00) return false;
  return (
    (code >= 0x11_00 && code <= 0x11_5f) ||
    code === 0x23_29 ||
    code === 0x23_2a ||
    (code >= 0x2e_80 && code <= 0xa4_cf && code !== 0x30_3f) ||
    (code >= 0xac_00 && code <= 0xd7_a3) ||
    (code >= 0xf9_00 && code <= 0xfa_ff) ||
    (code >= 0xfe_10 && code <= 0xfe_19) ||
    (code >= 0xfe_30 && code <= 0xfe_6f) ||
    (code >= 0xff_00 && code <= 0xff_60) ||
    (code >= 0xff_e0 && code <= 0xff_e6) ||
    (code >= 0x1_f3_00 && code <= 0x1_f6_4f) ||
    (code >= 0x1_f6_80 && code <= 0x1_f6_ff) ||
    (code >= 0x1_f9_00 && code <= 0x1_f9_ff) ||
    (code >= 0x26_00 && code <= 0x26_ff) ||
    (code >= 0x27_00 && code <= 0x27_bf)
  );
};

const isZeroWidth = (code) =>
  (code >= 0 && code <= 0x1f) ||
  code === 0x7f ||
  (code >= 0x03_00 && code <= 0x03_6f) ||
  (code >= 0x1a_b0 && code <= 0x1a_ff) ||
  (code >= 0x1d_c0 && code <= 0x1d_ff) ||
  (code >= 0x20_d0 && code <= 0x20_ff) ||
  (code >= 0xfe_20 && code <= 0xfe_2f) ||
  code === 0x20_0d ||
  (code >= 0xfe_0e && code <= 0xfe_0f);

const stringWidth = (input) => {
  const stripped = input.replaceAll(ANSI_REGEX, '');
  let width = 0;
  for (const char of stripped) {
    const code = char.codePointAt(0);
    if (!code || isZeroWidth(code)) continue;
    width += isFullwidthCodePoint(code) ? 2 : 1;
  }
  return width;
};

const wrapTextToWidth = (text, width) => {
  const lines = [];
  let current = '';
  let w = 0;
  for (const char of text) {
    if (char === '\n') {
      lines.push(current);
      current = '';
      w = 0;
      continue;
    }
    const code = char.codePointAt(0);
    const inc =
      // eslint-disable-next-line unicorn/no-nested-ternary
      !code || isZeroWidth(code) ? 0 : isFullwidthCodePoint(code) ? 2 : 1;
    if (w + inc > width && current) {
      lines.push(current);
      current = '';
      w = 0;
    }
    current += char;
    w += inc;
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
};

// =============================
// Banner 渲染工具
// =============================
const repeat = (ch, n) => ch.repeat(Math.max(0, n));
const pad = (s, width) => s + repeat(' ', Math.max(0, width - stringWidth(s)));

const termWidth = process?.stdout?.columns || 80;
const maxContent = Math.max(
  stringWidth('⚠️ 弃用通知'),
  ...contentLines.map((l) => stringWidth(l)),
);

// === 关键修改：支持配置内容宽度 ===
const extraWidth = 10; // 可调节：在内容宽度上额外增加 padding
const innerWidth = Math.min(
  Math.max(maxContent + extraWidth, 40),
  Math.max(40, termWidth - 4),
);

// 框架元素
const topBorder = `\n${red}╔${repeat('═', innerWidth + 2)}╗${reset}`;
const bottomBorder = `${red}╚${repeat('═', innerWidth + 2)}╝${reset}\n`;
const emptyLine = `${red}║${reset} ${repeat(' ', innerWidth)} ${red}║${reset}`;
const title = `${bgRed}${white}${bold}  ⚠️ 弃用通知  ${reset}`;
const titleLine = `${red}║${reset} ${pad(title, innerWidth)} ${red}║${reset}`;

// 内容
const wrappedBodyLines = contentLines
  .flatMap((l) => wrapTextToWidth(l, innerWidth - 2))
  .map((seg) => `${yellow}•${reset} ${seg}`);

const body = wrappedBodyLines
  .map((line) => `${red}║${reset} ${pad(line, innerWidth)} ${red}║${reset}`)
  .join('\n');

// 拼接 Banner
const banner = [
  topBorder,
  titleLine,
  emptyLine,
  body,
  emptyLine,
  bottomBorder,
].join('\n');

// 输出
try {
  console.warn(banner);
} catch {}
