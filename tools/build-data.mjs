/* Expands tools/authored.mjs into the runtime JSON the site fetches.
   Run with:  npm run data
   Keeps the hand-written content readable while giving every record the
   ids, dates, art seeds and popularity values the UI needs. */

import fs from 'fs';
import path from 'path';
import { CATEGORIES, MERCH, CHATBOT } from './authored.mjs';

const OUT = path.resolve('public/data');
fs.mkdirSync(OUT, { recursive: true });

const slug = (s) =>
  s.toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/* Deterministic pseudo-random so art and figures never change between builds */
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
};
const rand = (seed, min, max) => min + (hash(seed) % (max - min + 1));

/* Publication dates spread back from a fixed reference so "newest" is stable */
const REF = new Date('2026-09-20');
const dateBack = (seed, maxDays) => {
  const d = new Date(REF);
  d.setDate(d.getDate() - rand(seed, 1, maxDays));
  return d.toISOString().slice(0, 10);
};

const ARTICLE_BODY = (title, summary, cat, series) => [
  summary,
  `Across the ${cat.name.toLowerCase()} hub, ${series} has become the reference point for a particular kind of restraint — the sort where the most important thing in a scene is the thing deliberately left outside the frame. It is worth looking at how that restraint is actually constructed, because it is not an accident of budget.`,
  `The first thing to notice is structural. Every act break lands on a decision rather than a revelation, which means the audience is never waiting to be told something; they are waiting to see what someone does with what they already know. That is a slower engine, and it only works if the writing trusts the viewer completely.`,
  `The second is tonal. There is almost no score under the dialogue. When music does arrive it is doing narrative work rather than emotional underlining, and because it is rationed it lands every time. Compare this with the trailer cut, where the same cue is used three times in ninety seconds and means nothing by the end.`,
  `None of this would matter if the result were merely tasteful. What makes ${series} worth the attention is that the restraint is in service of an argument — that the small, repeated, unglamorous choice is where a life is actually decided. The form and the thesis are the same shape, which is rarer than it sounds.`,
].join('\n\n');

const index = [];

for (const cat of CATEGORIES) {
  const content = [];

  // ---- featured articles
  cat.articles.forEach(([title, summary], i) => {
    const id = `${cat.id}-art-${slug(title)}`;
    const series = cat.series[i % cat.series.length][0];
    content.push({
      id, catId: cat.id, type: 'article', title, summary,
      body: ARTICLE_BODY(title, summary, cat, series),
      series,
      tags: [cat.subTags[i % cat.subTags.length], 'Feature'],
      date: dateBack(id, 120),
      popularity: rand(id + 'p', 55, 99),
      featured: i === 0,
      seed: hash(id),
      readMins: rand(id + 'r', 4, 11),
    });
  });

  // ---- series entries browse as articles' companions
  cat.series.forEach(([title, summary], i) => {
    const id = `${cat.id}-series-${slug(title)}`;
    content.push({
      id, catId: cat.id, type: 'article', title, summary,
      body: ARTICLE_BODY(title, summary, cat, title),
      series: title,
      tags: [cat.subTags[i % cat.subTags.length], 'Series'],
      date: dateBack(id, 200),
      popularity: rand(id + 'p', 50, 97),
      featured: i === 1,
      seed: hash(id),
      readMins: rand(id + 'r', 3, 9),
    });
  });

  // ---- media (video + audio)
  cat.media.forEach(([title, kind, duration, status], i) => {
    const id = `${cat.id}-media-${slug(title)}`;
    content.push({
      id, catId: cat.id,
      type: kind === 'podcast' ? 'audio' : 'video',
      kind, title,
      summary: kind === 'trailer'
        ? `Official ${status === 'upcoming' ? 'first-look' : 'release'} trailer.`
        : kind === 'interview' ? 'A conversation with the people who made it.'
        : kind === 'podcast' ? 'Long-form discussion episode.'
        : 'Community-made video.',
      duration, status,
      series: cat.series[i % cat.series.length][0],
      tags: [kind[0].toUpperCase() + kind.slice(1), status === 'upcoming' ? 'Upcoming' : 'Recent'],
      date: dateBack(id, 90),
      popularity: rand(id + 'p', 40, 95),
      featured: false,
      seed: hash(id),
    });
  });

  // ---- gallery plates
  const gallery = cat.gallery.map((caption, i) => {
    const id = `${cat.id}-img-${i + 1}`;
    return { id, catId: cat.id, caption, seed: hash(id), ratio: i % 3 === 0 ? 'wide' : 'tall' };
  });
  content.push({
    id: `${cat.id}-gallery`, catId: cat.id, type: 'gallery',
    title: `${cat.name} Image Gallery`,
    summary: `${gallery.length} plates from across the ${cat.name.toLowerCase()} hub, viewable in a lightbox.`,
    tags: ['Gallery'], date: dateBack(`${cat.id}-gallery`, 60),
    popularity: rand(`${cat.id}-gal`, 60, 92), featured: false,
    seed: hash(`${cat.id}-gallery`), count: gallery.length,
  });

  // ---- characters
  const characters = cat.chars.map(([name, series, bio, traits]) => {
    const id = `${cat.id}-char-${slug(name)}`;
    return {
      id, catId: cat.id, type: 'character', name, title: name,
      series, bio, summary: bio.split('. ')[0] + '.', traits,
      tags: [series, ...traits.slice(0, 2)],
      date: dateBack(id, 150),
      popularity: rand(id + 'p', 45, 98),
      seed: hash(id), featured: false,
    };
  });

  // ---- events
  const events = cat.events.map(([title, date, location, description, status]) => {
    const id = `${cat.id}-evt-${slug(title)}`;
    return {
      id, catId: cat.id, type: 'event', title, date, location,
      description, summary: description, status,
      tags: [status === 'upcoming' ? 'Upcoming' : 'Past', cat.name],
      popularity: rand(id + 'p', 40, 90), seed: hash(id), featured: false,
    };
  });

  // ---- upcoming releases calendar
  const releases = cat.series.slice(0, 4).map(([title], i) => {
    const id = `${cat.id}-rel-${slug(title)}`;
    const d = new Date(REF);
    d.setDate(d.getDate() + rand(id, 3, 120));
    return {
      id, catId: cat.id, type: 'release', title,
      summary: `Next instalment of ${title}.`,
      date: d.toISOString().slice(0, 10),
      label: ['Season 2', 'Volume 12', 'Issue #60', 'Comeback', 'Update 4.0', 'Chapter 91'][(i + hash(id)) % 6],
      tags: ['Release'], popularity: rand(id + 'p', 50, 95), seed: hash(id), featured: false,
    };
  });

  const payload = {
    id: cat.id, name: cat.name, accent: cat.accent,
    tagline: cat.tagline, blurb: cat.blurb, subTags: cat.subTags,
    content, characters, events, gallery, releases,
  };

  fs.writeFileSync(path.join(OUT, `${cat.id}.json`), JSON.stringify(payload));

  index.push({
    id: cat.id, name: cat.name, accent: cat.accent,
    tagline: cat.tagline, blurb: cat.blurb, subTags: cat.subTags,
    counts: {
      content: content.length, characters: characters.length,
      events: events.length, gallery: gallery.length, releases: releases.length,
    },
    seed: hash(cat.id),
  });
}

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));

const merch = MERCH.map(([name, catId, price, blurb, kind]) => {
  const id = `merch-${slug(name)}`;
  return {
    id, catId, name, title: name, type: 'merch', price,
    blurb, summary: blurb, kind,
    tags: [kind, CATEGORIES.find((c) => c.id === catId).name],
    popularity: rand(id + 'p', 40, 97), seed: hash(id),
    stock: rand(id + 's', 3, 40),
  };
});
fs.writeFileSync(path.join(OUT, 'merch.json'), JSON.stringify(merch));
fs.writeFileSync(path.join(OUT, 'chatbot.json'), JSON.stringify(CHATBOT));

const totals = index.reduce((a, c) => {
  for (const k in c.counts) a[k] = (a[k] || 0) + c.counts[k];
  return a;
}, {});
console.log('categories :', index.length);
console.log('records    :', { ...totals, merch: merch.length });
console.log('written to : public/data/');
