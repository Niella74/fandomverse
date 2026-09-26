import { useMemo, useState } from 'react';
import { useAllCategories, flatten } from '../lib/data';
import { useAccent, Breadcrumbs } from '../components/Layout';
import { EventCard } from '../components/Card';
import { Chip, Empty, Rail, SectionHead, Tabs } from '../components/ui';

export default function Events() {
  useAccent('tv');
  const { data: cats, loading } = useAllCategories();
  const [when, setWhen] = useState('upcoming');
  const [cat, setCat] = useState('all');

  const events = useMemo(
    () => flatten(cats).filter((i) => i.type === 'event'),
    [cats]
  );

  const filtered = useMemo(() => {
    let list = events.filter((e) => (when === 'all' ? true : e.status === when));
    if (cat !== 'all') list = list.filter((e) => e.catId === cat);
    return list.sort((a, b) =>
      when === 'past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );
  }, [events, when, cat]);

  /* Group by month so the page reads as a diary rather than a flat list */
  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const d = new Date(e.date + 'T00:00:00');
      const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Events' }]} />

      <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
        Event highlights
      </h1>
      <p className="mt-1 max-w-xl text-[14px] text-ink-dim">
        Conventions, screenings, watch parties and launches across all seven worlds.
      </p>

      <div className="mt-5 space-y-3">
        <Tabs
          tabs={[
            { id: 'upcoming', label: 'Upcoming', count: events.filter((e) => e.status === 'upcoming').length },
            { id: 'past', label: 'Past', count: events.filter((e) => e.status === 'past').length },
            { id: 'all', label: 'All', count: events.length },
          ]}
          value={when}
          onChange={setWhen}
        />
        <Rail>
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All worlds</Chip>
          {(cats || []).map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              <span className="size-1.5 rounded-full" style={{ background: `var(--color-${c.accent})` }} />
              {c.name}
            </Chip>
          ))}
        </Rail>
      </div>

      <div className="mt-8 space-y-10">
        {loading && <p className="font-mono text-sm text-ink-mute">Loading…</p>}

        {!loading && grouped.length === 0 && (
          <Empty title="No events match" hint="Try a different period or clear the category filter." />
        )}

        {grouped.map(([month, list]) => (
          <section key={month}>
            <SectionHead
              eyebrow={`${list.length} event${list.length === 1 ? '' : 's'}`}
              title={month}
            />
            <div className="grid gap-3 lg:grid-cols-2">
              {list.map((e) => (
                <div key={e.id} id={e.id} style={{ '--accent': `var(--color-${e.accent})` }}>
                  <EventCard item={e} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
