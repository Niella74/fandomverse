import { useMemo, useState } from 'react';
import { useAllCategories, flatten, fmtDate } from '../lib/data';
import { useAccent, Breadcrumbs } from '../components/Layout';
import Artwork from '../components/Artwork';
import { Badge, BookmarkButton, Chip, Empty, Rail, SectionHead } from '../components/ui';
import { useStore } from '../lib/store';

/* Aggregated media across every world: trailers, interviews, podcasts and
   community videos. A selected item plays inline in the feature panel —
   the media itself is represented by its own key artwork, since the
   brief's original-content rule rules out embedding real footage. */

const KINDS = [
  ['all', 'Everything'], ['trailer', 'Trailers'], ['interview', 'Interviews'],
  ['podcast', 'Podcasts'], ['fan', 'Community'],
];

export default function Trailers() {
  useAccent('movies');
  const { data: cats, loading } = useAllCategories();
  const [kind, setKind] = useState('all');
  const [cat, setCat] = useState('all');
  const [status, setStatus] = useState('all');
  const [active, setActive] = useState(null);

  const media = useMemo(
    () => flatten(cats).filter((i) => i.type === 'video' || i.type === 'audio'),
    [cats]
  );

  const filtered = useMemo(() => {
    let list = media;
    if (kind !== 'all') list = list.filter((i) => i.kind === kind);
    if (cat !== 'all') list = list.filter((i) => i.catId === cat);
    if (status !== 'all') list = list.filter((i) => i.status === status);
    return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [media, kind, cat, status]);

  const feature = active || filtered[0];
  const { isBookmarked, toggleBookmark } = useStore();

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Trailers & Media' }]} />

      <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
        Trailers &amp; media
      </h1>
      <p className="mt-1 max-w-xl text-[14px] text-ink-dim">
        Every trailer, interview, podcast and community video across the seven worlds.
      </p>

      {feature && (
        <section
          className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface"
          style={{ '--accent': `var(--color-${feature.accent})` }}
        >
          <div className="relative aspect-[16/8] w-full">
            <Artwork id={feature.id} seed={feature.seed} ratio="wide" label={feature.title} />
            <div
              className="absolute inset-0 grid place-items-center"
              style={{ background: 'linear-gradient(to top, var(--color-void), transparent 60%)' }}
            >
              <button
                className="grid size-16 place-items-center rounded-full border-2 transition-transform duration-200 hover:scale-110"
                style={{ borderColor: 'var(--accent)', background: 'color-mix(in oklab, var(--accent) 20%, transparent)' }}
                aria-label={`Play ${feature.title}`}
              >
                <span className="ml-1 text-2xl" style={{ color: 'var(--accent)' }}>▶</span>
              </button>
            </div>
            <span className="absolute bottom-3 right-3 rounded-md bg-void/80 px-2 py-1 font-mono text-[11px] text-ink backdrop-blur">
              {feature.duration}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{feature.kind}</Badge>
                <Badge tone={feature.status === 'upcoming' ? 'soon' : 'mute'}>
                  {feature.status === 'upcoming' ? 'Upcoming' : 'Recent'}
                </Badge>
                <span className="font-mono text-[11px] text-ink-mute">{feature.catName}</span>
              </div>
              <h2 className="font-display text-[20px] font-extrabold leading-tight text-ink sm:text-[24px]">
                {feature.title}
              </h2>
              <p className="mt-1 text-[14px] text-ink-dim">{feature.summary}</p>
              <p className="mt-2 font-mono text-[11px] text-ink-mute">
                {feature.series} · {fmtDate(feature.date)}
              </p>
            </div>
            <BookmarkButton
              active={isBookmarked(feature.id)}
              onClick={() => toggleBookmark(feature)}
              className="shrink-0"
            />
          </div>
        </section>
      )}

      <div className="mt-8 space-y-3">
        <Rail>
          {KINDS.map(([id, label]) => (
            <Chip key={id} active={kind === id} onClick={() => setKind(id)}>{label}</Chip>
          ))}
        </Rail>
        <Rail>
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All worlds</Chip>
          {(cats || []).map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              <span className="size-1.5 rounded-full" style={{ background: `var(--color-${c.accent})` }} />
              {c.name}
            </Chip>
          ))}
        </Rail>
        <Rail>
          {[['all', 'Any status'], ['recent', 'Recently released'], ['upcoming', 'Upcoming']].map(([id, label]) => (
            <Chip key={id} active={status === id} onClick={() => setStatus(id)}>{label}</Chip>
          ))}
        </Rail>
      </div>

      <SectionHead
        className="mt-8"
        eyebrow={loading ? 'Loading' : `${filtered.length} items`}
        title="All media"
      />

      {filtered.length === 0 ? (
        <Empty title="Nothing matches those filters" hint="Try widening the kind or status." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <button
              key={m.id}
              id={m.id}
              onClick={() => { setActive(m); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group flex gap-3 rounded-xl border border-line bg-surface p-3 text-left transition-colors duration-200 hover:border-[var(--accent)]"
              style={{ '--accent': `var(--color-${m.accent})` }}
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line">
                <Artwork id={m.id} seed={m.seed} ratio="wide" label={m.title} />
                <span className="absolute bottom-1 right-1 rounded bg-void/85 px-1 font-mono text-[9px] text-ink">
                  {m.duration}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink transition-colors group-hover:text-[var(--accent)]">
                  {m.title}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  {m.kind} · {m.catName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
