/* Downscales and re-encodes everything in public/img/ to WebP.
   Run with:  npm run optimise

   Source files come off Openverse at full resolution — far larger than the
   UI ever displays. The site is judged on Lighthouse performance, so images
   are resized to the largest size actually rendered and re-encoded. Output
   is .webp with the correct extension, which also fixes source files that
   arrived as WebP inside a .jpg name. */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMG = path.resolve('public/img');
const SRC = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

/* Longest edge per role — generous enough for retina at the rendered size */
const size = (name) =>
  name.endsWith('-banner') ? 1400
  : name.startsWith('merch-') ? 900
  : name.includes('-img-') ? 900
  : 700;

const files = fs.readdirSync(IMG).filter((f) => SRC.has(path.extname(f).toLowerCase()));
let before = 0, after = 0, done = 0, failed = 0;

for (const file of files) {
  const full = path.join(IMG, file);
  const base = path.basename(file, path.extname(file));
  const out = path.join(IMG, `${base}.webp`);
  const originalBytes = fs.statSync(full).size;

  try {
    const buf = await sharp(full)
      .rotate()
      .resize({ width: size(base), height: size(base), fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toBuffer();

    if (full !== out) fs.unlinkSync(full);
    fs.writeFileSync(out, buf);

    before += originalBytes;
    after += buf.length;
    done++;
  } catch (e) {
    failed++;
    console.log(`  ✗ ${file}: ${e.message.slice(0, 60)}`);
  }
}

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log(`optimised : ${done} images`);
if (failed) console.log(`failed    : ${failed}`);
console.log(`before    : ${mb(before)}`);
console.log(`after     : ${mb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`);
