/* Scans public/img/ and writes the manifest the app reads.
   Run with:  npm run images

   Naming rule: the file's basename must equal the record id.
   e.g. public/img/anime-char-mirei-ashgrove.jpg
   Extension can be .jpg .jpeg .png .webp .avif — whichever you have.

   Anything without a matching file keeps its procedural artwork, so you
   can add images a few at a time and the site stays complete throughout. */

import fs from 'fs';
import path from 'path';

const IMG = path.resolve('public/img');
const OK = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

fs.mkdirSync(IMG, { recursive: true });

const manifest = {};
let skipped = 0;

for (const file of fs.readdirSync(IMG)) {
  const ext = path.extname(file).toLowerCase();
  if (!OK.has(ext)) {
    if (file !== 'manifest.json' && !file.startsWith('.')) skipped++;
    continue;
  }
  manifest[path.basename(file, ext)] = file;
}

fs.writeFileSync(path.join(IMG, 'manifest.json'), JSON.stringify(manifest, null, 1));

/* Report coverage against the actual records so you can see what's left */
const DATA = path.resolve('public/data');
let ids = [];
if (fs.existsSync(path.join(DATA, 'index.json'))) {
  const index = JSON.parse(fs.readFileSync(path.join(DATA, 'index.json'), 'utf8'));
  for (const c of index) {
    const cat = JSON.parse(fs.readFileSync(path.join(DATA, `${c.id}.json`), 'utf8'));
    ids.push(
      `${c.id}-banner`,
      ...cat.content.map((x) => x.id),
      ...cat.characters.map((x) => x.id),
      ...cat.gallery.map((x) => x.id)
    );
  }
  const merch = JSON.parse(fs.readFileSync(path.join(DATA, 'merch.json'), 'utf8'));
  ids.push(...merch.map((m) => m.id));
}

const have = ids.filter((id) => manifest[id]).length;
const orphan = Object.keys(manifest).filter((k) => !ids.includes(k));

console.log(`images found : ${Object.keys(manifest).length}`);
console.log(`records      : ${ids.length}`);
console.log(`covered      : ${have} (${ids.length ? Math.round((have / ids.length) * 100) : 0}%) — the rest use the built-in artwork`);
if (skipped) console.log(`skipped      : ${skipped} file(s) with an unsupported extension`);
if (orphan.length) {
  console.log(`unmatched    : ${orphan.length} file(s) whose name matches no record:`);
  orphan.slice(0, 10).forEach((o) => console.log(`   ${o}`));
}
console.log('written      : public/img/manifest.json');
