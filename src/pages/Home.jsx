import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllCategories, flatten, fmtDate, SORTS } from '../lib/data';
import { routeFor } from '../lib/routes';
import { useAccent } from '../components/Layout';
import { ContentCard } from '../components/Card';
import Artwork from '../components/Artwork';
import { Badge, Chip, Rail, SectionHead, Tabs } from '../components/ui';

/* Home: a rotating featured showcase, the seven category doors, a sorted
   grid of everything new, and rails for upcoming releases and events. */

function Hero({ items }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) return null;
  const item = items[i];

  return (
    <section
      className="relative mb-10 overflow-hidden rounded-2xl border border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured across FandomVerse"
      style={{ '--accent': `var(--color-${item.accent})` }}
    >
      <div className="absolute inset-0">
        <Artwork id={item.id} seed={item.seed} ratio="wide" label={item.title} priority />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--color-void) 8%, color-mix(in oklab, var(--color-void) 72%, transparent) 45%, transparent 90%), linear-gradient(to right, var(--color-void) 2%, transparent 55%)',
        }}
      />

      <div className="relative flex min-h-[340px] flex-col justify-end gap-3 p-6 sm:min-h-[400px] sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{item.catName}</Badge>
          {item.tags?.slice(0, 2).map((t) => (
            <span key={t} className="font-mono text-[11px] text-ink-dim">{t}</span>
          ))}
        </div>

        <h1 className="max-w-2xl text-balance font-display text-[30px] font-extrabold leading-[1.08] text-ink sm:text-[44px]">
          {item.title}
        </h1>
        <p className="max-w-xl text-[14px] leading-relaxed text-ink-dim sm:text-[15px]">
          {item.summary}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Link
            to={routeFor(item)}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-void transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: 'var(--accent)' }}
          >
            Read more
          </Link>
          <Link
            to={`/c/${item.catId}`}
            className="rounded-lg border border-line bg-void/50 px-5 py-2.5 text-sm font-semibold text-ink backdrop-blur transition-colors duration-200 hover:border-ink-mute"
          >
            Explore {item.catName}
          </Link>
        </div>

        <div className="absolute right-6 top-6 flex items-center gap-2">
          <button
            onClick={() => setI((n) => (n - 1 + items.length) % items.length)}
            aria-label="Previous featured item"
            className="grid size-8 place-items-center rounded-full border border-line bg-void/60 text-ink backdrop-blur"
          >‹</button>
          <span className="rounded-full border border-line bg-void/60 px-2.5 py-1 font-mono text-[11px] tabular-nums text-ink backdrop-blur">
            {i + 1} / {items.length}
          </span>
          <button
            onClick={() => setI((n) => (n + 1) % items.length)}
            aria-label="Next featured item"
            className="grid size-8 place-items-center rounded-full border border-line bg-void/60 text-ink backdrop-blur"
          >›</button>
        </div>
      </div>
    </section>
  );
}

function CategoryDoors({ index }) {
  return (
    <section className="mb-10">
      <SectionHead eyebrow="Seven worlds" title="Choose a fandom" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {index.map((c) => (
          <Link
            key={c.id}
            to={`/c/${c.id}`}
            className="group relative overflow-hidden rounded-xl border border-line bg-surface p-4 transition-colors duration-200 hover:border-[var(--accent)]"
            style={{ '--accent': `var(--color-${c.accent})` }}
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px] transition-all duration-300 group-hover:h-1.5"
              style={{ background: `var(--color-${c.accent})` }}
            />
            <div
              className="absolute -right-6 -top-6 size-20 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: `var(--color-${c.accent})` }}
            />
            <h3 className="relative mt-1 font-display text-[15px] font-extrabold text-ink">{c.name}</h3>
            <p className="relative mt-1 line-clamp-2 text-[12px] leading-snug text-ink-mute">
              {c.tagline}
            </p>
            <p className="relative mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              {c.counts.content + c.counts.characters} entries
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  useAccent('anime');
  const { data: cats, loading } = useAllCategories();
  const [sort, setSort] = useState('newest');
  const [catFilter, setCatFilter] = useState('all');

  const all = useMemo(() => flatten(cats), [cats]);

  const featured = useMemo(
    () => all.filter((i) => i.featured).slice(0, 9),
    [all]
  );

  const browse = useMemo(() => {
    const pool = all.filter(
      (i) => ['article', 'video', 'audio'].includes(i.type) &&
        (catFilter === 'all' || i.catId === catFilter)
    );
    return [...pool].sort(SORTS[sort].fn).slice(0, 14);
  }, [all, sort, catFilter]);

  const releases = useMemo(
    () => all.filter((i) => i.type === 'release')
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10),
    [all]
  );

  const events = useMemo(
    () => all.filter((i) => i.type === 'event' && i.status === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4),
    [all]
  );

  if (loading || !cats) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <p className="font-mono text-sm text-ink-mute">Loading the seven worlds…</p>
      </div>
    );
  }

  const index = cats.map((c) => ({
    id: c.id, name: c.name, accent: c.accent, tagline: c.tagline,
    counts: { content: c.content.length, characters: c.characters.length },
  }));

  return (
    <>
      <Hero items={featured} />
      <CategoryDoors index={index} />

      <section className="mb-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <SectionHead
            eyebrow="Across every world"
            title="What's new"
            action={
              <Tabs
                tabs={Object.entries(SORTS).map(([id, s]) => ({ id, label: s.label }))}
                value={sort}
                onChange={setSort}
                className="w-auto"
              />
            }
          />

          <Rail className="mb-5">
            <Chip active={catFilter === 'all'} onClick={() => setCatFilter('all')}>
              All worlds
            </Chip>
            {cats.map((c) => (
              <Chip
                key={c.id}
                active={catFilter === c.id}
                onClick={() => setCatFilter(c.id)}
                className={catFilter === c.id ? '' : ''}
              >
                <span className="size-1.5 rounded-full" style={{ background: `var(--color-${c.accent})` }} />
                {c.name}
              </Chip>
            ))}
          </Rail>

          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-5">
            {browse.map((item) => (
              <div key={item.id} style={{ '--accent': `var(--color-${item.accent})` }}>
                <ContentCard item={item} to={routeFor(item)} />
              </div>
            ))}
          </div>
        </div>

        <aside className="min-w-0 space-y-8">
          <div>
            <SectionHead
              eyebrow="Diary"
              title="Upcoming events"
              action={<Link to="/events" className="font-mono text-[11px] text-ink-mute hover:text-ink">All →</Link>}
            />
            <ul className="space-y-2">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-line bg-surface p-3"
                  style={{ '--accent': `var(--color-${e.accent})` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                      {fmtDate(e.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] font-semibold leading-snug text-ink">{e.title}</p>
                  <p className="mt-0.5 text-[11px] text-ink-mute">{e.location}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="mb-4">
        <SectionHead eyebrow="Calendar" title="Upcoming releases" />
        <Rail>
          {releases.map((r) => (
            <Link
              key={r.id}
              to={`/c/${r.catId}?tab=releases`}
              className="group w-[190px] shrink-0 rounded-xl border border-line bg-surface p-3 transition-colors duration-200 hover:border-ink-mute"
              style={{ '--accent': `var(--color-${r.accent})` }}
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge>{r.label}</Badge>
                <span className="font-mono text-[10px] tabular-nums text-ink-mute">{fmtDate(r.date)}</span>
              </div>
              <div className="mb-2 h-20 overflow-hidden rounded-lg border border-line">
                <Artwork id={r.id} seed={r.seed} ratio="wide" label={r.title} />
              </div>
              <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink transition-colors group-hover:text-[var(--accent)]">
                {r.title}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-mute">{r.catName}</p>
            </Link>
          ))}
        </Rail>
      </section>
    </>
  );
}
