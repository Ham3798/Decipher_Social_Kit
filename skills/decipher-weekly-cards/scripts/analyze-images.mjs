#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tif', '.tiff', '.heic', '.heif']);

function usage() {
  console.error('Usage: analyze-images.mjs <photo-folder>');
  process.exit(2);
}

function classify(width, height) {
  const aspect = width / height;
  if (aspect >= 1.85) return 'wide';
  if (aspect > 1.15) return 'landscape';
  if (aspect <= 0.55) return 'tall';
  if (aspect < 0.87) return 'portrait';
  return 'square';
}

function layoutHint(kind) {
  switch (kind) {
    case 'wide':
      return 'preserve context; use contain or shallow crop in a wide white frame';
    case 'landscape':
      return 'good for weekly/speaker; crop lightly and keep slides or presenter visible';
    case 'tall':
      return 'avoid forced cover crop; use contain, blur-fill, or a narrow framed panel';
    case 'portrait':
      return 'protect face/body; use contain or portrait-oriented frame';
    default:
      return 'center crop only if subject is centered; otherwise preserve full image';
  }
}

function dimensionsWithSips(filePath) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', filePath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
  const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
  if (!widthMatch || !heightMatch) throw new Error('sips did not return dimensions');
  return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) };
}

function collectImages(folder) {
  return readdirSync(folder)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .map((name) => path.join(folder, name))
    .filter((filePath) => statSync(filePath).isFile())
    .sort((a, b) => a.localeCompare(b));
}

const folder = process.argv[2];
if (!folder) usage();

let folderStat;
try {
  folderStat = statSync(folder);
} catch {
  console.error(`Photo folder does not exist: ${folder}`);
  process.exit(1);
}

if (!folderStat.isDirectory()) {
  console.error(`Photo path is not a directory: ${folder}`);
  process.exit(1);
}

const images = collectImages(folder);
if (images.length === 0) {
  console.error(`No image files found in: ${folder}`);
  process.exit(1);
}

const results = images.map((filePath) => {
  const { width, height } = dimensionsWithSips(filePath);
  const aspect = width / height;
  const kind = classify(width, height);
  return {
    file: filePath,
    name: path.basename(filePath),
    width,
    height,
    aspect: Number(aspect.toFixed(3)),
    classification: kind,
    layoutHint: layoutHint(kind),
  };
});

console.log(JSON.stringify({ folder, count: results.length, images: results }, null, 2));
