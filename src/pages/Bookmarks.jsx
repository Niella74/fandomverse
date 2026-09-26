import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAllCategories, flatten, TYPE_LABEL, fmtDate } from '../lib/data';
import { routeFor } from '../lib/routes';
import { useAccent, Breadcrumbs } from '../components/Layout';
import Artwork from '../components/Artwork';
import { Badge, Chip, Empty } from '../components/ui';
import { useStore } from '../lib/store';

/* Saved items live in localStorage; the note attached to each one lives in
   sessionStorage and is therefore deliberately lost when the tab closes.
   Export produces a formatted plain-text list the visitor can copy. */

export default function Bookmarks() {
  useAccent('manga');
  const { bookmarks, notes, toggleBookmark, clearBookmarks, setNote } = useStore();
  const { data: cats } = useAllCategories();
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState(false);

  const all = useMemo(() => flatten(cats), [cats]);

  /* Merge stored stubs with the full record so cards can render art */
  const items = useMemo(() => {
    return bookmarks
      .map((b) => {
        const full = all.find((i) => i.id === b.id);
        return full ? { ...full, savedAt: b.at } : { ...b, savedAt: b.at, seed: 1 };
      })
      .filter((i) => filter === 'all' || i.type === filter);
  }, [bookmarks, all, filter]);

  const types = useMemo(
    () => [...new Set(bookmarks.map((b) => b.type))].filter(Boolean),
    [bookmarks]
  );

  const exportText = useMemo(() => {
    const lines = [
      'FANDOMVERSE — SAVED ITEMS',
      `Exported ${new Date().toLocaleString('en-GB')}`,
      `${bookmarks.length} item${bookmarks.length === 1 ? '' : 's'}`,
      '='.repeat(46),
      '',
    ];
    for (const b of bookmarks) {
      const full = all.find((i) => i.id === b.id);
      lines.push(`• ${b.title || 'Untitled'}`);
      lines.push(`  Type:  ${TYPE_LABEL[b.type] || b.type || '—'}`);
      if (full?.catName) lines.push(`  World: ${full.catName}`);
      if (full?.series) lines.push(`  From:  ${full.series}`);
      lines.push(`  Saved: ${new Date(b.at).toLocaleDateString('en-GB')}`);
      if (notes[b.id]) lines.push(`  Note:  ${notes[b.id]}`);
      lines.push('');
    }
    return lines.join('\n');
  }, [bookmarks, notes, all]);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Bookmarks' }]} />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
            Saved items
          </h1>
          <p className="mt-1 max-w-xl text-[14px] text-ink-dim">
            Bookmarks are kept in this browser. Notes are session-only and clear when you
            close the tab.
          </p>
        </div>
        {bookmarks.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={copyExport}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-void transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: 'var(--accent)' }}
            >
              {copied ? 'Copied ✓' : 'Export list'}
            </button>
            <button
              onClick={clearBookmarks}
              className="rounded-lg border border-line px-4 py-2 text-sm text-ink-dim transition-colors hover:text-ink"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <Empty
          title="No bookmarks yet"
          hint="Use the bookmark control on any card, article, character or product to save it here."
          action={
            <Link
              to="/"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-void"
              style={{ background: 'var(--accent)' }}
            >
              Start exploring
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
              All ({bookmarks.length})
            </Chip>
            {types.map((t) => (
              <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>
                {TYPE_LABEL[t] || t} ({bookmarks.filter((b) => b.type === t).length})
              </Chip>
            ))}
          </div>

          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-line bg-surface p-3"
                style={{ '--accent': `var(--color-${item.accent || item.catId || 'manga'})` }}
              >
                <div className="flex gap-3">
                  <Link to={routeFor(item)} className="shrink-0">
                    <div className="h-20 w-16 overflow-hidden rounded-lg border border-line">
                      <Artwork id={item.id} seed={item.seed} label={item.title} />
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge>{TYPE_LABEL[item.type] || item.type}</Badge>
                      {item.catName && (
                        <span className="font-mono text-[11px] text-ink-mute">{item.catName}</span>
                      )}
                      <span className="font-mono text-[10px] text-ink-mute">
                        saved {fmtDate(new Date(item.savedAt).toISOString().slice(0, 10))}
                      </span>
                    </div>

                    <Link to={routeFor(item)}>
                      <h2 className="text-[15px] font-semibold leading-snug text-ink hover:text-[var(--accent)]">
                        {item.title}
                      </h2>
                    </Link>
                    {item.series && (
                      <p className="mt-0.5 font-mono text-[11px] text-ink-mute">{item.series}</p>
                    )}

                    <label htmlFor={`note-${item.id}`} className="sr-only">
                      Note for {item.title}
                    </label>
                    <input
                      id={`note-${item.id}`}
                      value={notes[item.id] || ''}
                      onChange={(e) => setNote(item.id, e.target.value)}
                      placeholder="Add a session note…"
                      className="mt-2 w-full rounded-lg border border-line bg-void px-3 py-1.5 text-[12px] text-ink outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <button
                    onClick={() => toggleBookmark(item)}
                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-ink-mute transition-colors hover:text-ink"
                    aria-label={`Remove ${item.title} from bookmarks`}
                  >✕</button>
                </div>
              </li>
            ))}
          </ul>

        </>
      )}
    </>
  );
}
