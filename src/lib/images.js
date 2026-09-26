import { useEffect, useState } from 'react';
import { loadJSON } from './data';

/* ============================================================
   Artwork resolution.

   Every record can have a real image file. public/img/manifest.json
   lists which ids actually have one — written by `npm run images`,
   which scans the folder. Checking a manifest rather than letting an
   <img> 404 keeps the console clean and avoids a failed request per
   missing file.

   Anything without a file falls back to the procedural artwork, so the site is
   complete at every stage of filling the folder in.
   ============================================================ */

let manifestCache = null;

export async function loadManifest() {
  if (manifestCache) return manifestCache;
  try {
    manifestCache = await loadJSON('../img/manifest');
  } catch {
    manifestCache = {};
  }
  return manifestCache;
}

export function useManifest() {
  const [manifest, setManifest] = useState(manifestCache || {});
  useEffect(() => {
    let alive = true;
    loadManifest().then((m) => alive && setManifest(m));
    return () => { alive = false; };
  }, []);
  return manifest;
}

export const imageSrc = (manifest, id) =>
  manifest && manifest[id] ? `${import.meta.env.BASE_URL}img/${manifest[id]}` : null;
