import { useEffect, useState } from 'react';

/* All content is fetched from static JSON under public/data — no backend,
   no writes. A tiny in-memory cache keeps hub switches instant. */

const cache = new Map();
const BASE = `${import.meta.env.BASE_URL}data`;

export async function loadJSON(name) {
  if (cache.has(name)) return cache.get(name);
  const p = fetch(`${BASE}/${name}.json`).then((r) => {
    if (!r.ok) throw new Error(`Could not load ${name}.json`);
    return r.json();
  });
  cache.set(name, p);
  return p;
}

export function useJSON(name) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    let alive = true;
    setState({ data: null, error: null, loading: true });
    loadJSON(name)
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState({ data: null, error, loading: false }));
    return () => {
      alive = false;
    };
  }, [name]);
  return state;
}

/* Loads every category at once — used by search, trailers, events and home. */
export function useAllCategories() {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    let alive = true;
    loadJSON('index')
      .then((index) => Promise.all(index.map((c) => loadJSON(c.id))))
      .then((cats) => alive && setState({ data: cats, error: null, loading: false }))
      .catch((error) => alive && setState({ data: null, error, loading: false }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/* Flattens every record in every category into one searchable list. */
export function flatten(categories) {
  if (!categories) return [];
  const out = [];
  for (const cat of categories) {
    for (const c of cat.content) out.push({ ...c, catName: cat.name, accent: cat.accent });
    for (const c of cat.characters) out.push({ ...c, catName: cat.name, accent: cat.accent });
    for (const e of cat.events) out.push({ ...e, catName: cat.name, accent: cat.accent });
    for (const r of cat.releases) out.push({ ...r, catName: cat.name, accent: cat.accent });
  }
  return out;
}

export const TYPE_LABEL = {
  article: 'Article',
  gallery: 'Gallery',
  video: 'Video',
  audio: 'Audio',
  character: 'Character',
  event: 'Event',
  release: 'Release',
  merch: 'Merchandise',
};

/* A media record's `kind` (trailer, interview, podcast, fan) is more useful
   on a card than the generic "Video"/"Audio", but it has to be presented in
   the same case as every other badge. */
export const KIND_LABEL = {
  trailer: 'Trailer',
  interview: 'Interview',
  podcast: 'Podcast',
  fan: 'Community',
};

export const typeBadge = (item) =>
  (item.kind && (KIND_LABEL[item.kind] || item.kind[0].toUpperCase() + item.kind.slice(1))) ||
  TYPE_LABEL[item.type] ||
  item.type;

export const SORTS = {
  newest: { label: 'Newest', fn: (a, b) => (b.date || '').localeCompare(a.date || '') },
  popular: { label: 'Popular', fn: (a, b) => (b.popularity || 0) - (a.popularity || 0) },
  az: { label: 'A–Z', fn: (a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || '') },
};

/* Scores a record against a query. Title matches outrank tag and body matches. */
export function searchScore(item, q) {
  if (!q) return 0;
  const needle = q.toLowerCase().trim();
  if (!needle) return 0;
  const title = (item.title || item.name || '').toLowerCase();
  const summary = (item.summary || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  const series = (item.series || '').toLowerCase();

  if (title === needle) return 100;
  if (title.startsWith(needle)) return 80;
  if (title.includes(needle)) return 60;
  if (series.includes(needle)) return 45;
  if (tags.includes(needle)) return 35;
  if (summary.includes(needle)) return 20;
  return 0;
}

export const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const fmtMoney = (n) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'NGN' }).format(n);
