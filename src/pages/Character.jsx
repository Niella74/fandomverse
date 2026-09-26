import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useJSON } from '../lib/data';
import { useAccent, Breadcrumbs } from '../components/Layout';
import { CharacterCard } from '../components/Card';
import Artwork from '../components/Artwork';
import { Badge, BookmarkButton, Empty, SectionHead } from '../components/ui';
import { useStore } from '../lib/store';

export default function Character() {
  const { catId, itemId } = useParams();
  const { data: cat, loading } = useJSON(catId);
  const { isBookmarked, toggleBookmark, notes, setNote } = useStore();
  useAccent(cat?.accent);

  const person = useMemo(
    () => cat?.characters.find((c) => c.id === itemId),
    [cat, itemId]
  );

  const others = useMemo(
    () => (cat?.characters || []).filter((c) => c.id !== itemId),
    [cat, itemId]
  );

  if (loading) {
    return <div className="grid min-h-[50vh] place-items-center"><p className="font-mono text-sm text-ink-mute">Loading…</p></div>;
  }
  if (!person) {
    return <Empty title="Profile not found" action={<Link to={`/c/${catId}?tab=characters`} className="font-mono text-sm text-ink-dim hover:text-ink">← All characters</Link>} />;
  }

  const saved = isBookmarked(person.id);
  const note = notes[person.id] || '';

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: cat.name, to: `/c/${cat.id}` },
          { label: 'Characters', to: `/c/${cat.id}?tab=characters` },
          { label: person.name },
        ]}
      />

      <article className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="aspect-[4/5]">
              <Artwork id={person.id} seed={person.seed} ratio="square" label={person.name} />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => toggleBookmark(person)}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-void transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: saved ? 'var(--color-raised)' : 'var(--accent)', color: saved ? 'var(--color-ink)' : undefined }}
            >
              {saved ? 'Bookmarked' : 'Bookmark'}
            </button>
            <BookmarkButton active={saved} onClick={() => toggleBookmark(person)} className="size-auto px-3" />
          </div>

          <dl className="mt-4 space-y-0 overflow-hidden rounded-xl border border-line bg-surface text-[13px]">
            {[
              ['Series', person.series],
              ['World', cat.name],
              ['Traits', person.traits.length],
              ['Popularity', `★ ${person.popularity}`],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <dt className="text-ink-mute">{k}</dt>
                <dd className="truncate text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <Badge>Character profile</Badge>
          <h1 className="mt-2 text-balance font-display text-[32px] font-extrabold leading-[1.1] text-ink sm:text-[40px]">
            {person.name}
          </h1>
          <p className="mt-1 font-mono text-[12px] text-ink-mute">{person.series}</p>

          <h2 className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
            Biography
          </h2>
          <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.75] text-ink-dim">{person.bio}</p>

          <h2 className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
            Defining traits
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {person.traits.map((t) => (
              <li
                key={t}
                className="rounded-full border px-3.5 py-1.5 text-[13px] font-medium"
                style={{
                  borderColor: 'color-mix(in oklab, var(--accent) 40%, transparent)',
                  background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-7 rounded-xl border border-line bg-surface p-4">
            <label htmlFor="cnote" className="block font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              Personal note · session only
            </label>
            <textarea
              id="cnote"
              value={note}
              onChange={(e) => setNote(person.id, e.target.value)}
              rows={2}
              placeholder="Add a thought about this character…"
              className="mt-1 w-full resize-none rounded-lg border border-line bg-void px-3 py-2 text-[13px] text-ink outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="mt-12">
          <SectionHead eyebrow={cat.name} title="More from this world" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((c) => (
              <CharacterCard key={c.id} item={c} to={`/c/${cat.id}/character/${c.id}`} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
