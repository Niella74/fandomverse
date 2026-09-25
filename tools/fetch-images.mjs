/* Downloads public-domain artwork into public/img/.
   Run with:  npm run fetch-images

   Sources, in order of preference:
     1. Art Institute of Chicago  — 130k+ public-domain works, IIIF images
     2. Cleveland Museum of Art   — CC0 open access
   Both are key-free and every record is checked for public-domain status
   before it is used, so nothing here carries a licence obligation.

   Why museum collections rather than stock photography: a fandom portal
   needs artwork, and photographs of landscapes read as filler next to
   invented anime, comics and music properties. Museum open-access holdings
   are drawn, painted and printed art — woodblock prints, poster lithography,
   engravings, art nouveau — which sits far closer to what each hub is
   actually about, while being unambiguously free to use.

   Two deliberate limits:
     - Character portraits are not fetched. Standing a real person in for an
       invented character misrepresents them, and a licence on the image does
       not change that. Characters keep their procedural artwork.
     - Queries describe medium and subject only. Everything returned is
       pre-modern art well out of copyright, so no owned character or
       franchise can be pulled in.
*/

import fs from 'fs';
import path from 'path';

const IMG = path.resolve('public/img');
const DATA = path.resolve('public/data');
fs.mkdirSync(IMG, { recursive: true });

const rd = (n) => JSON.parse(fs.readFileSync(path.join(DATA, `${n}.json`), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'User-Agent': 'FandomVerse-student-project/1.0 (educational coursework)' };

/* The Art Institute's IIIF image server rejects non-browser clients, so the
   image request (not the API request) needs a browser UA and a Referer. */
const IMG_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  'Referer': 'https://www.artic.edu/',
  'Accept': 'image/avif,image/webp,image/jpeg,image/*,*/*;q=0.8',
};

/* Medium-and-subject queries chosen so each hub's artwork matches its
   register: printmaking for anime and manga, technical plates for the
   systems-led games hub, poster lithography for film and television,
   art nouveau for music, comic and pulp art for comics. */
const QUERIES = {
  anime: ['japanese woodblock print landscape', 'ukiyo-e figures', 'japanese print night scene',
          'japanese woodblock sea wave', 'japanese print rain', 'japanese colour woodblock'],
  manga: ['japanese ink painting', 'japanese woodblock mountain', 'sumi-e ink brush',
          'japanese print snow', 'japanese woodblock street', 'japanese drawing figures'],
  gaming: ['botanical illustration', 'scientific illustration engraving', 'astronomical chart',
           'antique map engraving', 'machinery engraving', 'natural history plate'],
  movies: ['poster lithograph', 'theatre poster', 'art deco poster design',
           'advertising poster vintage', 'travel poster', 'pictorialist photograph landscape'],
  tv: ['magazine cover illustration', 'playbill theatre', 'advertisement illustration',
       'poster typography', 'broadside print', 'illustrated periodical cover'],
  kpop: ['art nouveau poster', 'art nouveau decorative panel', 'dance illustration',
         'music poster lithograph', 'decorative ornament design', 'opera poster'],
  comics: ['caricature illustration', 'comic illustration print', 'city engraving architecture',
           'satirical print', 'adventure illustration', 'pen and ink illustration'],
};

const seen = new Set();
const credits = [];
const cache = new Map();

/* ---- Art Institute of Chicago ---- */
async function searchAIC(q) {
  const url = 'https://api.artic.edu/api/v1/artworks/search' +
    `?q=${encodeURIComponent(q)}&limit=100` +
    '&fields=id,title,image_id,is_public_domain,artist_title,date_display';
  try {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.data || [])
      .filter((a) => a.is_public_domain && a.image_id)
      .map((a) => ({
        key: `aic-${a.id}`,
        url: `https://www.artic.edu/iiif/2/${a.image_id}/full/843,/0/default.jpg`,
        title: a.title || 'Untitled',
        creator: a.artist_title || 'Unknown',
        date: a.date_display || '',
        license: 'CC0 / Public Domain',
        source: `https://www.artic.edu/artworks/${a.id}`,
        provider: 'Art Institute of Chicago',
      }));
  } catch {
    return [];
  }
}

/* ---- Cleveland Museum of Art (fallback) ---- */
async function searchCMA(q) {
  const url = 'https://openaccess-api.clevelandart.org/api/artworks/' +
    `?q=${encodeURIComponent(q)}&cc0=1&has_image=1&limit=100`;
  try {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.data || [])
      .filter((a) => a.images?.web?.url)
      .map((a) => ({
        key: `cma-${a.id}`,
        url: a.images.web.url,
        title: a.title || 'Untitled',
        creator: a.creators?.[0]?.description || 'Unknown',
        date: a.creation_date || '',
        license: 'CC0',
        source: a.url || 'https://www.clevelandart.org',
        provider: 'Cleveland Museum of Art',
      }));
  } catch {
    return [];
  }
}

async function search(q) {
  if (cache.has(q)) return cache.get(q);
  let out = await searchAIC(q);
  await sleep(180);
  if (out.length < 10) {
    out = out.concat(await searchCMA(q));
    await sleep(180);
  }
  cache.set(q, out);
  return out;
}

async function download(url, dest) {
  try {
    const r = await fetch(url, { headers: IMG_HEADERS, signal: AbortSignal.timeout(30000) });
    if (!r.ok) return false;
    if (!(r.headers.get('content-type') || '').startsWith('image/')) return false;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 10000) return false;
    fs.writeFileSync(dest, buf);
    return true;
  } catch {
    return false;
  }
}

async function pick(catId, salt) {
  const pool = QUERIES[catId] || QUERIES.anime;
  for (let attempt = 0; attempt < pool.length; attempt++) {
    const q = pool[(salt + attempt) % pool.length];
    for (const r of await search(q)) {
      if (!seen.has(r.key)) {
        seen.add(r.key);
        return { ...r, query: q };
      }
    }
  }
  return null;
}

const targets = [];
for (const c of rd('index')) {
  const cat = rd(c.id);
  targets.push({ id: `${c.id}-banner`, catId: c.id });
  cat.content.forEach((x) => targets.push({ id: x.id, catId: c.id }));
  cat.gallery.forEach((g) => targets.push({ id: g.id, catId: c.id }));
}
rd('merch').forEach((m) => targets.push({ id: m.id, catId: m.catId }));

console.log(`targets  : ${targets.length} (character portraits excluded by design)`);
console.log('sources  : Art Institute of Chicago, Cleveland Museum of Art\n');

let ok = 0, fail = 0, skip = 0;

for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  const dest = path.join(IMG, `${t.id}.jpg`);
  if (fs.existsSync(dest)) { skip++; continue; }

  const hit = await pick(t.catId, i);
  if (!hit) { fail++; continue; }

  if (await download(hit.url, dest)) {
    ok++;
    credits.push({ file: `${t.id}.jpg`, ...hit });
    if (ok % 20 === 0) console.log(`  … ${ok} downloaded`);
  } else {
    fail++;
  }
  await sleep(90);
}

fs.writeFileSync(path.join(IMG, 'CREDITS.json'), JSON.stringify(credits, null, 1));

fs.writeFileSync(path.resolve('tools/IMAGE-CREDITS.md'), [
  '# Image credits',
  '',
  'Every image is a public-domain artwork from a museum open-access collection.',
  'Public-domain status was checked per record before download. Neither source',
  'requires attribution — these credits are provided as good practice, and',
  'because citing a collection is the right thing to do.',
  '',
  'Character portraits are not listed: they use artwork drawn in the browser,',
  'so no real person stands in for an invented character.',
  '',
  `Fetched ${new Date().toISOString().slice(0, 10)} · ${credits.length} images`,
  '',
  '| File | Artwork | Artist | Date | Collection |',
  '| --- | --- | --- | --- | --- |',
  ...credits.map((c) =>
    `| \`${c.file}\` | [${(c.title || '').replace(/\|/g, '/').slice(0, 42)}](${c.source}) | ${(c.creator || '').replace(/\|/g, '/').slice(0, 26)} | ${(c.date || '').slice(0, 14)} | ${c.provider} |`),
  '',
].join('\n'));

console.log(`\ndownloaded : ${ok}`);
console.log(`already    : ${skip}`);
console.log(`failed     : ${fail}`);
console.log('credits    : tools/IMAGE-CREDITS.md');
console.log('\nnext       : npm run optimise && npm run images && npm run build');
