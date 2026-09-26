import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllCategories, flatten, searchScore, TYPE_LABEL } from '../lib/data';
import { routeFor } from '../lib/routes';

/* Global search overlay. Opens on ⌘K / Ctrl+K from anywhere, searches the
   whole flattened dataset client-side, and is fully keyboard-driven. */

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { data: cats } = useAllCategories();

  const all = useMemo(() => flatten(cats), [cats]);

  const results = useMemo(() => {
    if (!q.trim()) {
      return all
        .filter((i) => i.featured || i.popularity > 90)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8);
    }
    return all
      .map((i) => ({ i, s: searchScore(i, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || b.i.popularity - a.i.popularity)
      .slice(0, 12)
      .map((r) => r.i);
  }, [q, all]);

  useEffect(() => { setActive(0); }, [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      // focus after paint so the caret actually lands
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && results[active]) {
        e.preventDefault();
        navigate(routeFor(results[active]));
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, navigate, onClose]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-void/80 p-4 pt-[10vh] backdrop-blur-sm"
      style={{ zIndex: 'var(--z-modal)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Search FandomVerse"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            id="palette-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search series, characters, events, releases…"
            className="w-full bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-ink-mute"
            aria-label="Search query"
            autoComplete="off"
          />
          <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-mute">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-mute">
              Nothing matches “{q}”. Try a series name, a character, or a category.
            </p>
          ) : (
            <>
              {!q.trim() && (
                <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
                  Suggested
                </p>
              )}
              <ul>
                {results.map((r, i) => (
                  <li key={r.id}>
                    <button
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => { navigate(routeFor(r)); onClose(); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150"
                      style={i === active ? { background: 'var(--color-raised)' } : undefined}
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ background: `var(--color-${r.accent})` }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] text-ink">{r.title || r.name}</span>
                        <span className="block truncate font-mono text-[11px] text-ink-mute">
                          {r.catName} · {TYPE_LABEL[r.type] || r.type}
                          {r.series ? ` · ${r.series}` : ''}
                        </span>
                      </span>
                      {i === active && (
                        <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-mute">↵</kbd>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-ink-mute">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span className="tabular-nums">{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}
