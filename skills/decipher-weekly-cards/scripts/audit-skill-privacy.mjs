#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillRoot = resolve(process.argv[2] ?? resolve(scriptDir, '..'));
const scriptRelativePath = relative(skillRoot, fileURLToPath(import.meta.url));

const textExtensions = new Set([
  '', '.md', '.mdx', '.txt', '.json', '.yaml', '.yml', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.html',
]);
const blockedMediaExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.heic', '.heif', '.webp', '.gif', '.tif', '.tiff', '.bmp', '.mov', '.mp4',
]);
const allowedHandles = new Set(['@decipher_global']);
const ignoredDirectories = new Set(['.git', 'node_modules', 'output', 'dist']);

const contentRules = [
  { type: 'personal home path', pattern: /(?:\/Users|\/home)\/[^/\s]+\//g },
  { type: 'Windows user path', pattern: /[A-Za-z]:\\Users\\[^\\\s]+\\/g },
  { type: 'email address', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { type: 'phone number', pattern: /(?:\+?82[-\s]?)?0?1[016789][-\s]?\d{3,4}[-\s]?\d{4}\b/g },
  { type: 'message-export filename', pattern: /(?:KakaoTalk|IMG|Screenshot|Photo)_\S*\.(?:png|jpe?g|heic|webp)/gi },
  { type: 'credential-like assignment', pattern: /\b(?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["'][^"']{8,}["']/gi },
];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const fullPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

function collectHandleViolations(content, filePath) {
  const violations = [];
  const handlePattern = /(^|[^A-Za-z0-9._%+-])@[A-Za-z0-9_]{2,30}\b/g;

  for (const match of content.matchAll(handlePattern)) {
    const handle = match[0].match(/@[A-Za-z0-9_]{2,30}\b/)?.[0];
    if (!handle) continue;
    if (!allowedHandles.has(handle)) {
      violations.push({
        type: 'non-allowlisted social handle',
        filePath,
        line: lineNumberAt(content, match.index ?? 0),
      });
    }
  }

  return violations;
}

async function main() {
  const rootStats = await stat(skillRoot);
  if (!rootStats.isDirectory()) throw new Error('Audit target must be a directory.');

  const violations = [];
  const files = await listFiles(skillRoot);

  for (const filePath of files) {
    const relativePath = relative(skillRoot, filePath);
    const extension = extname(filePath).toLowerCase();

    if (blockedMediaExtensions.has(extension)) {
      violations.push({ type: 'media file in reusable skill', filePath: relativePath });
      continue;
    }

    if (!textExtensions.has(extension) || relativePath === scriptRelativePath) continue;

    const content = await readFile(filePath, 'utf8');
    for (const rule of contentRules) {
      for (const match of content.matchAll(rule.pattern)) {
        violations.push({
          type: rule.type,
          filePath: relativePath,
          line: lineNumberAt(content, match.index ?? 0),
        });
      }
    }
    violations.push(...collectHandleViolations(content, relativePath));
  }

  if (violations.length > 0) {
    console.error(`Privacy audit failed with ${violations.length} violation(s):`);
    for (const violation of violations) {
      const location = violation.line ? `${violation.filePath}:${violation.line}` : violation.filePath;
      console.error(`- ${violation.type}: ${location}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Privacy audit passed for ${relative(process.cwd(), skillRoot) || '.'}.`);
}

main().catch((error) => {
  console.error(`Privacy audit could not run: ${error.message}`);
  process.exitCode = 1;
});
