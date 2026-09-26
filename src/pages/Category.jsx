import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useJSON, SORTS, fmtDate } from '../lib/data';
import { routeFor } from '../lib/routes';
import { useAccent, Breadcrumbs } from '../components/Layout';
import { ContentCard, CharacterCard, EventCard } from '../components/Card';
import Artwork from '../components/Artwork';
import { Badge, Chip, Empty, Lightbox, Rail, SectionHead, Tabs } from '../components/ui';

const TYPE_FILTERS = [
  ['all', 'Everything'], ['article', 'Articles'], ['gallery', 'Galleries'],
  ['video', 'Videos'], ['audio', 'Audio'], ['character', 'Characters'],
  ['event', 'Events'], ['merch', 'Merchandise'], ['release', 'Releases'],
];

export default function Category() {
  const { catId } = useParams();
  const { data: cat, loading, error } = useJSON(catId);
  const { data: allMerch } = useJSON('merch');
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'browse';

  const [typeFilter, setTypeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [lightbox, setLightbox] = useState(-1);
  const [franchise, setFranchise] = useState('all');

  useAccent(cat?.accent);

  /* Items left after the type filter alone — the tag chips are built from
     this, so every chip on screen is guaranteed to return results. */
  /* Everything this hub holds, so all eight type filters return results
     rather than only the four that live in `content`. */
  const everything = useMemo(() => {
    if (!cat) return [];
    return [
      ...cat.content,
      ...cat.characters,
      ...cat.events,
      ...cat.releases,
      ...(allMerch || []).filter((m) => m.catId === cat.id),
    ];
  }, [cat, allMerch]);

  const byType = useMemo(() => {
    if (typeFilter === 'all') return everything;
    return everything.filter((i) => i.type === typeFilter);
  }, [everything, typeFilter]);

  /* Real tag vocabulary with counts, commonest first. The hand-written
     subTags list only covered articles, which left every video, audio and
     gallery record unreachable by tag. */
  const availableTags = useMemo(() => {
    const counts = new Map();
    for (const item of byType) {
      for (const t of item.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [byType]);

  /* If a type change strands the active tag, fall back to All rather than
     leaving the visitor staring at an empty grid. */
  useEffect(() => {
    if (tagFilter !== 'all' && !availableTags.some(([t]) => t === tagFilter)) {
      setTagFilter('all');
    }
  }, [availableTags, tagFilter]);

  /* Franchises present in this hub, with a count each — the SRS asks for
     character profiles to be filterable by franchise as well as category. */
  const franchises = useMemo(() => {
    if (!cat) return [];
    const counts = new Map();
    for (const c of cat.characters) counts.set(c.series, (counts.get(c.series) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [cat]);

  const people = useMemo(() => {
    if (!cat) return [];
    return franchise === 'all'
      ? cat.characters
      : cat.characters.filter((c) => c.series === franchise);
  }, [cat, franchise]);

  const filtered = useMemo(() => {
    let list = byType;
    if (tagFilter !== 'all') list = list.filter((i) => i.tags?.includes(tagFilter));

    /* Browse mixes published records with releases dated in the future.
       Under "Newest" an unreleased item is not new, it is upcoming — so
       future-dated records sort after everything already published. */
    if (sort === 'newest') {
      const today = new Date().toISOString().slice(0, 10);
      const published = list.filter((i) => !i.date || i.date <= today).sort(SORTS.newest.fn);
      const upcoming = list.filter((i) => i.date && i.date > today)
        .sort((a, b) => a.date.localeCompare(b.date));
      return [...published, ...upcoming];
    }
    return [...list].sort(SORTS[sort].fn);
  }, [byType, tagFilter, sort]);

  if (error) {
    return <Empty title="That world doesn't exist" hint="Check the address, or pick a category from the menu." />;
  }
  if (loading || !cat) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <p className="font-mono text-sm text-ink-mute">Loading…</p>
      </div>
    );
  }

  const setTab = (id) => {
    const next = new URLSearchParams(params);
    if (id === 'browse') next.delete('tab');
    else next.set('tab', id);
    setParams(next, { replace: true });
  };

  const tabs = [
    { id: 'browse', label: 'Browse', count: everything.length },
    { id: 'characters', label: 'Characters', count: cat.characters.length },
    { id: 'gallery', label: 'Gallery', count: cat.gallery.length },
    { id: 'events', label: 'Events', count: cat.events.length },
    { id: 'releases', label: 'Releases', count: cat.releases.length },
  ];

  return (
    <>
      <Breadcrumbs trail={[{ label: cat.name }]} />

      {/* Hub banner — artwork behind, category identity in front */}
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-line">
        <div className="absolute inset-0 opacity-70">
          <Artwork id={`${cat.id}-banner`} seed={cat.content[0]?.seed || 7} ratio="wide" label={cat.name} />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, var(--color-void) 10%, color-mix(in oklab, var(--color-void) 70%, transparent) 55%, transparent)',
          }}
        />
        <div className="relative flex min-h-[200px] flex-col justify-end p-6 sm:p-9">
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: 'var(--accent)' }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
              Fandom world
            </span>
          </div>
          <h1 className="font-display text-[32px] font-extrabold leading-none text-ink sm:text-[42px]">
            {cat.name}
          </h1>
          <p className="mt-2 max-w-xl text-[14px] italic text-ink-dim">{cat.tagline}</p>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-dim">{cat.blurb}</p>
        </div>
      </section>

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-6" />

      {tab === 'browse' && (
        <>
          <div className="mb-5 space-y-3">
            <Rail>
              {TYPE_FILTERS.map(([id, label]) => {
                const n = id === 'all'
                  ? everything.length
                  : everything.filter((i) => i.type === id).length;
                if (n === 0) return null;
                return (
                  <Chip key={id} active={typeFilter === id} onClick={() => setTypeFilter(id)}>
                    {label}
                    <span className="font-mono text-[11px] opacity-60">{n}</span>
                  </Chip>
                );
              })}
            </Rail>
            <Rail>
              <Chip active={tagFilter === 'all'} onClick={() => setTagFilter('all')}>
                All tags
                <span className="font-mono text-[11px] opacity-60">{byType.length}</span>
              </Chip>
              {availableTags.map(([t, n]) => (
                <Chip key={t} active={tagFilter === t} onClick={() => setTagFilter(t)}>
                  {t}
                  <span className="font-mono text-[11px] opacity-60">{n}</span>
                </Chip>
              ))}
            </Rail>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] tabular-nums text-ink-mute">
                {filtered.length} item{filtered.length === 1 ? '' : 's'}
              </p>
              <Tabs
                tabs={Object.entries(SORTS).map(([id, s]) => ({ id, label: s.label }))}
                value={sort}
                onChange={setSort}
                className="w-auto"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <Empty
              title="Nothing matches those filters"
              hint="Try widening the type or clearing the tag."
              action={
                <button
                  onClick={() => { setTypeFilter('all'); setTagFilter('all'); }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-void"
                  style={{ background: 'var(--accent)' }}
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
              {filtered.map((item) => (
                <ContentCard key={item.id} item={item} to={routeFor({ ...item, catId: cat.id })} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'characters' && (
        <>
          <SectionHead
            eyebrow={`${people.length} of ${cat.characters.length} profiles`}
            title="Characters"
          />

          <Rail className="mb-5">
            <Chip active={franchise === 'all'} onClick={() => setFranchise('all')}>
              All franchises
              <span className="font-mono text-[11px] opacity-60">{cat.characters.length}</span>
            </Chip>
            {franchises.map(([name, n]) => (
              <Chip key={name} active={franchise === name} onClick={() => setFranchise(name)}>
                {name}
                <span className="font-mono text-[11px] opacity-60">{n}</span>
              </Chip>
            ))}
          </Rail>

          {people.length === 0 ? (
            <Empty
              title="No profiles in that franchise"
              action={
                <button
                  onClick={() => setFranchise('all')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-void"
                  style={{ background: 'var(--accent)' }}
                >
                  Show all
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {people.map((c) => (
                <CharacterCard key={c.id} item={c} to={`/c/${cat.id}/character/${c.id}`} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'gallery' && (
        <>
          <SectionHead
            eyebrow={`${cat.gallery.length} plates`}
            title="Image gallery"
            action={<span className="font-mono text-[11px] text-ink-mute">Select to enlarge</span>}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cat.gallery.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setLightbox(i)}
                className="group overflow-hidden rounded-xl border border-line bg-surface text-left transition-colors duration-200 hover:border-[var(--accent)]"
                aria-label={`Open ${g.caption}`}
              >
                <div className={g.ratio === 'wide' ? 'aspect-[16/10]' : 'aspect-[4/5]'}>
                  <div className="size-full transition-transform duration-500 ease-[var(--ease-fv)] group-hover:scale-105">
                    <Artwork id={g.id} seed={g.seed} ratio={g.ratio === 'wide' ? 'wide' : 'square'} label={g.caption} />
                  </div>
                </div>
                <p className="px-3 py-2 text-[12px] text-ink-dim">{g.caption}</p>
              </button>
            ))}
          </div>
          {lightbox >= 0 && (
            <Lightbox
              items={cat.gallery}
              index={lightbox}
              onIndex={setLightbox}
              onClose={() => setLightbox(-1)}
              renderItem={(g) => (
                <div className="aspect-[16/10]">
                  <Artwork id={g.id} seed={g.seed} ratio="wide" label={g.caption} />
                </div>
              )}
            />
          )}
        </>
      )}

      {tab === 'events' && (
        <>
          <SectionHead eyebrow={`${cat.events.length} listed`} title="Event highlights" />
          <div className="grid gap-3 lg:grid-cols-2">
            {cat.events.map((e) => (
              <EventCard key={e.id} item={{ ...e, catName: cat.name }} />
            ))}
          </div>
        </>
      )}

      {tab === 'releases' && (
        <>
          <SectionHead eyebrow="What's coming" title="Upcoming releases" />
          <ul className="space-y-2">
            {[...cat.releases].sort((a, b) => a.date.localeCompare(b.date)).map((r) => {
              const days = Math.ceil((new Date(r.date) - new Date()) / 86400000);
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3"
                >
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line">
                    <Artwork id={r.id} seed={r.seed} ratio="wide" label={r.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge>{r.label}</Badge>
                      <span className="font-mono text-[11px] text-ink-mute">{fmtDate(r.date)}</span>
                    </div>
                    <p className="truncate text-[14px] font-semibold text-ink">{r.title}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] tabular-nums"
                    style={{ color: days <= 30 ? 'var(--accent)' : 'var(--color-ink-mute)' }}
                  >
                    {days > 0 ? `in ${days}d` : 'out now'}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
