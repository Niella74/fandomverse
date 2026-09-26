import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* Small shared primitives. Each is styled through the accent token so a
   component picks up whichever fandom world it is rendered inside. */

export function Chip({ active, children, onClick, as = 'button', to, className = '' }) {
  const base =
    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200';
  const tone = active
    ? 'border-transparent text-void'
    : 'border-line bg-surface text-ink-dim hover:text-ink hover:border-ink-mute';
  const style = active ? { background: 'var(--accent)' } : undefined;

  if (as === 'link') {
    return (
      <Link to={to} className={`${base} ${tone} ${className}`} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${tone} ${className}`} style={style}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'accent', className = '' }) {
  const tones = {
    accent: { background: 'color-mix(in oklab, var(--accent) 18%, transparent)', color: 'var(--accent)' },
    live: { background: 'color-mix(in oklab, var(--color-live) 16%, transparent)', color: 'var(--color-live)' },
    soon: { background: 'color-mix(in oklab, var(--color-soon) 16%, transparent)', color: 'var(--color-soon)' },
    mute: { background: 'var(--color-raised)', color: 'var(--color-ink-dim)' },
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${className}`}
      style={tones[tone]}
    >
      {children}
    </span>
  );
}

export function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div
      role="tablist"
      className={`fv-rail flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1 ${className}`}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors duration-200 ${
              active ? 'text-void' : 'text-ink-dim hover:text-ink'
            }`}
            style={active ? { background: 'var(--accent)' } : undefined}
          >
            {t.label}
            {t.count != null && (
              <span className="ml-1.5 font-mono text-[11px] opacity-70">{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Horizontal scroller with arrow affordances that hide when they'd do nothing. */
export function Rail({ children, className = '' }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const nudge = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const Arrow = ({ dir, show }) => (
    <button
      type="button"
      onClick={() => nudge(dir)}
      aria-label={dir < 0 ? 'Scroll left' : 'Scroll right'}
      className={`absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-raised/90 text-ink backdrop-blur transition-opacity duration-200 ${
        show ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${dir < 0 ? 'left-0' : 'right-0'}`}
    >
      {dir < 0 ? '‹' : '›'}
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      <Arrow dir={-1} show={edges.left} />
      <div ref={ref} onScroll={measure} className="fv-rail flex gap-3 overflow-x-auto scroll-smooth pb-2">
        {children}
      </div>
      <Arrow dir={1} show={edges.right} />
    </div>
  );
}

export function SectionHead({ eyebrow, title, action, className = '' }) {
  return (
    <div className={`mb-4 flex items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && (
          <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-[22px] font-extrabold leading-tight text-ink sm:text-[26px]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function Empty({ title, hint, action }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
      <div
        className="mb-3 size-10 rounded-full"
        style={{ background: 'color-mix(in oklab, var(--accent) 22%, transparent)' }}
      />
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-ink-dim">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function BookmarkButton({ active, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove bookmark' : 'Add bookmark'}
      title={active ? 'Remove bookmark' : 'Add bookmark'}
      className={`grid size-8 place-items-center rounded-lg border border-line bg-void/70 backdrop-blur transition-colors duration-200 hover:border-ink-mute ${className}`}
      style={active ? { color: 'var(--accent)', borderColor: 'var(--accent)' } : { color: 'var(--color-ink-dim)' }}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M6 4h12v16l-6-4-6 4V4z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* Lightbox for the per-category galleries. Traps Escape and arrow keys. */
export function Lightbox({ items, index, onClose, onIndex, renderItem }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, items.length, onClose, onIndex]);

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 grid place-items-center bg-void/92 p-4 backdrop-blur-sm"
      style={{ zIndex: 'var(--z-modal)' }}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line bg-raised text-ink"
      >
        ✕
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}
        aria-label="Previous image"
        className="absolute left-3 grid size-11 place-items-center rounded-full border border-line bg-raised/80 text-ink backdrop-blur sm:left-6"
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}
        aria-label="Next image"
        className="absolute right-3 grid size-11 place-items-center rounded-full border border-line bg-raised/80 text-ink backdrop-blur sm:right-6"
      >
        ›
      </button>

      <figure className="max-h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-xl border border-line">{renderItem(item)}</div>
        <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-ink">{item.caption}</span>
          <span className="font-mono text-xs text-ink-mute">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
