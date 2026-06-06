#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tif', '.tiff', '.heic', '.heif']);

function usage() {
  console.error('Usage: validate-weekly-input.mjs <photo-folder>');
  process.exit(2);
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

const images = readdirSync(folder)
  .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
  .map((name) => path.join(folder, name))
  .filter((filePath) => {
    try {
      return statSync(filePath).isFile();
    } catch {
      return false;
    }
  });

if (images.length === 0) {
  console.error(`No supported image files found in: ${folder}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  folder,
  imageCount: images.length,
  supportedExtensions: Array.from(IMAGE_EXTENSIONS).sort(),
}, null, 2));
