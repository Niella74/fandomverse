import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useJSON, fmtDate, TYPE_LABEL } from '../lib/data';
import { routeFor } from '../lib/routes';
import { useAccent, Breadcrumbs } from '../components/Layout';
import { ContentCard } from '../components/Card';
import Artwork from '../components/Artwork';
import { Badge, BookmarkButton, Empty, SectionHead } from '../components/ui';
import { useStore } from '../lib/store';

export default function Article() {
  const { catId, itemId } = useParams();
  const { data: cat, loading } = useJSON(catId);
  const { isBookmarked, toggleBookmark, notes, setNote } = useStore();
  useAccent(cat?.accent);

  const item = useMemo(
    () => cat?.content.find((c) => c.id === itemId),
    [cat, itemId]
  );

  const related = useMemo(() => {
    if (!cat || !item) return [];
    return cat.content
      .filter((c) => c.id !== item.id && c.type === 'article')
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
  }, [cat, item]);

  if (loading) {
    return <div className="grid min-h-[50vh] place-items-center"><p className="font-mono text-sm text-ink-mute">Loading…</p></div>;
  }
  if (!item) {
    return <Empty title="Article not found" hint="It may have moved." action={<Link to={`/c/${catId}`} className="font-mono text-sm text-ink-dim hover:text-ink">← Back to hub</Link>} />;
  }

  const saved = isBookmarked(item.id);
  const note = notes[item.id] || '';

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: cat.name, to: `/c/${cat.id}` },
          { label: item.title },
        ]}
      />

      <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="mb-5 overflow-hidden rounded-2xl border border-line">
            <div className="aspect-[16/7]">
              <Artwork id={item.id} seed={item.seed} ratio="wide" label={item.title} />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge>{TYPE_LABEL[item.type]}</Badge>
            {item.tags?.map((t) => (
              <span key={t} className="rounded-md bg-raised px-2 py-0.5 text-[11px] text-ink-dim">{t}</span>
            ))}
          </div>

          <h1 className="text-balance font-display text-[28px] font-extrabold leading-[1.12] text-ink sm:text-[38px]">
            {item.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-ink-mute">
            <span>{fmtDate(item.date)}</span>
            {item.readMins && <span>{item.readMins} min read</span>}
            {item.series && <span>Series: {item.series}</span>}
            <span className="tabular-nums">★ {item.popularity}</span>
          </div>

          {/* Body: measure kept near 65 characters for readability */}
          <div className="mt-6 max-w-[62ch] space-y-5">
            {(item.body || item.summary).split('\n\n').map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-[17px] leading-[1.7] text-ink'
                    : 'text-[15px] leading-[1.75] text-ink-dim'
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <aside className="min-w-0 space-y-5">
          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[15px] font-bold text-ink">Save this</h2>
              <BookmarkButton active={saved} onClick={() => toggleBookmark(item)} />
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-mute">
              Bookmarks persist in this browser. Notes last for this session only.
            </p>

            <label htmlFor="note" className="mt-3 block font-mono text-[10px] uppercase tracking-wider text-ink-mute">
              Personal note
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(item.id, e.target.value)}
              rows={3}
              placeholder={saved ? 'Add a thought…' : 'Bookmark first to keep a note'}
              className="mt-1 w-full resize-none rounded-lg border border-line bg-void px-3 py-2 text-[13px] text-ink outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="rounded-xl border border-line bg-surface p-4">
            <h2 className="mb-2 font-display text-[15px] font-bold text-ink">In this world</h2>
            <Link
              to={`/c/${cat.id}`}
              className="flex items-center gap-2 text-[13px] text-ink-dim hover:text-ink"
            >
              <span className="size-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              Back to {cat.name}
            </Link>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-mute">{cat.tagline}</p>
          </div>
        </aside>
      </article>

      {related.length > 0 && (
        <section className="mt-12">
          <SectionHead eyebrow="Keep reading" title="Related in this world" />
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
            {related.map((r) => (
              <ContentCard key={r.id} item={r} to={routeFor({ ...r, catId: cat.id })} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
