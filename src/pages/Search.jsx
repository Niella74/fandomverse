import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAllCategories, flatten, searchScore, SORTS, TYPE_LABEL } from '../lib/data';
import { routeFor } from '../lib/routes';
import { useAccent, Breadcrumbs } from '../components/Layout';
import { ContentCard } from '../components/Card';
import { Chip, Empty, Rail, Tabs } from '../components/ui';

const TYPES = ['all', 'article', 'character', 'video', 'audio', 'event', 'release', 'gallery'];

export default function Search() {
  useAccent('kpop');
  const [params, setParams] = useSearchParams();
  const { data: cats, loading } = useAllCategories();

  const q = params.get('q') || '';
  const cat = params.get('cat') || 'all';
  const type = params.get('type') || 'all';
  const [sort, setSort] = useState('popular');

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (!v || v === 'all') next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

  const all = useMemo(() => flatten(cats), [cats]);

  const results = useMemo(() => {
    let list = all;
    if (cat !== 'all') list = list.filter((i) => i.catId === cat);
    if (type !== 'all') list = list.filter((i) => i.type === type);
    if (q.trim()) {
      list = list
        .map((i) => ({ i, s: searchScore(i, q) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.i);
    } else {
      list = [...list].sort(SORTS[sort].fn);
    }
    return list;
  }, [all, q, cat, type, sort]);

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Search' }]} />

      <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
        Search everything
      </h1>
      <p className="mt-1 max-w-xl text-[14px] text-ink-dim">
        One index across all seven worlds — articles, characters, media, events and releases.
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-surface px-4">
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <label htmlFor="search-q" className="sr-only">Search query</label>
        <input
          id="search-q"
          value={q}
          onChange={(e) => set('q', e.target.value)}
          placeholder="Try a series, a character, or a trait…"
          className="w-full bg-transparent py-3.5 text-[15px] text-ink outline-none placeholder:text-ink-mute"
          autoComplete="off"
        />
        {q && (
          <button onClick={() => set('q', '')} className="shrink-0 font-mono text-[11px] text-ink-mute hover:text-ink">
            clear
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <Rail>
          <Chip active={cat === 'all'} onClick={() => set('cat', 'all')}>All worlds</Chip>
          {(cats || []).map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => set('cat', c.id)}>
              <span className="size-1.5 rounded-full" style={{ background: `var(--color-${c.accent})` }} />
              {c.name}
            </Chip>
          ))}
        </Rail>
        <Rail>
          {TYPES.map((t) => (
            <Chip key={t} active={type === t} onClick={() => set('type', t)}>
              {t === 'all' ? 'All types' : TYPE_LABEL[t]}
            </Chip>
          ))}
        </Rail>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tabular-nums text-ink-mute">
            {loading ? 'Searching…' : `${results.length} result${results.length === 1 ? '' : 's'}`}
            {q && ` for “${q}”`}
          </p>
          {!q && (
            <Tabs
              tabs={Object.entries(SORTS).map(([id, s]) => ({ id, label: s.label }))}
              value={sort}
              onChange={setSort}
              className="w-auto"
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        {results.length === 0 && !loading ? (
          <Empty
            title={q ? `Nothing matches “${q}”` : 'No results for those filters'}
            hint="Try a different spelling, or widen the category and type filters."
            action={
              <button
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-void"
                style={{ background: 'var(--accent)' }}
              >
                Reset search
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
            {results.slice(0, 60).map((item) => (
              <div key={item.id} style={{ '--accent': `var(--color-${item.accent})` }}>
                <ContentCard item={item} to={routeFor(item)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
