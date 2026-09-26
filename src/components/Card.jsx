import { Link } from 'react-router-dom';
import Artwork from './Artwork';
import { Badge, BookmarkButton } from './ui';
import { typeBadge, fmtDate } from '../lib/data';
import { useStore } from '../lib/store';

/* One content card, used by every hub, search result and rail.
   Poster cards sit at 2:3; the metadata row underneath stays a fixed
   height so a grid of them shares baselines regardless of title length. */

export function ContentCard({ item, to, compact = false }) {
  const { isBookmarked, toggleBookmark } = useStore();
  const saved = isBookmarked(item.id);
  const title = item.title || item.name;

  return (
    <article className="group relative">
      <Link to={to} className="block">
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
          <div className="aspect-[2/3] w-full overflow-hidden">
            <div className="size-full transition-transform duration-500 ease-[var(--ease-fv)] group-hover:scale-[1.06]">
              <Artwork id={item.id} seed={item.seed} label={title} />
            </div>
          </div>

          {/* type + duration sit on the art so the row below stays clean */}
          <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-2">
            <Badge>{typeBadge(item)}</Badge>
            {item.duration && (
              <span className="rounded-md bg-void/80 px-1.5 py-0.5 font-mono text-[10px] text-ink backdrop-blur">
                {item.duration}
              </span>
            )}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'linear-gradient(to top, var(--color-void), transparent)' }}
          />
        </div>
      </Link>

      <BookmarkButton
        active={saved}
        onClick={() => toggleBookmark(item)}
        className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      />

      <div className="mt-2.5">
        <Link to={to}>
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-[var(--accent)]">
            {title}
          </h3>
        </Link>
        {!compact && (
          <>
            <p className="mt-1 line-clamp-1 font-mono text-[11px] text-ink-mute">
              {item.series || item.catName || ''}
              {item.date ? ` · ${fmtDate(item.date)}` : ''}
            </p>
            {item.summary && (
              <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-dim">
                {item.summary}
              </p>
            )}
            {item.tags?.length > 0 && (
              <ul className="mt-1.5 flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((t) => (
                  <li
                    key={t}
                    className="rounded px-1.5 py-0.5 text-[10px] text-ink-mute"
                    style={{ background: 'var(--color-raised)' }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </article>
  );
}

/* Event card — date block on the left, as an event listing reads better
   scanned by date than by title. */
export function EventCard({ item }) {
  const { isBookmarked, toggleBookmark } = useStore();
  const saved = isBookmarked(item.id);
  const d = new Date(item.date + 'T00:00:00');

  return (
    <article className="group flex gap-4 rounded-xl border border-line bg-surface p-4 transition-colors duration-200 hover:border-ink-mute">
      <div
        className="grid h-16 w-14 shrink-0 place-items-center rounded-lg border border-line text-center"
        style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }}
      >
        <div>
          <div className="font-display text-xl font-extrabold leading-none tabular-nums text-ink">
            {d.getDate()}
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
            {d.toLocaleDateString('en-GB', { month: 'short' })}
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge tone={item.status === 'upcoming' ? 'soon' : 'mute'}>
            {item.status === 'upcoming' ? 'Upcoming' : 'Past'}
          </Badge>
          <span className="truncate font-mono text-[11px] text-ink-mute">{item.catName}</span>
        </div>
        <h3 className="text-[15px] font-semibold leading-snug text-ink">{item.title}</h3>
        <p className="mt-0.5 text-[12px] text-ink-mute">{item.location}</p>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-dim">
          {item.description}
        </p>
      </div>

      <BookmarkButton active={saved} onClick={() => toggleBookmark(item)} className="shrink-0" />
    </article>
  );
}

/* Character card — portrait-led, traits shown as chips. */
export function CharacterCard({ item, to }) {
  const { isBookmarked, toggleBookmark } = useStore();
  const saved = isBookmarked(item.id);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-200 hover:border-ink-mute">
      <Link to={to} className="block">
        <div className="aspect-[4/5] w-full overflow-hidden">
          <div className="size-full transition-transform duration-500 ease-[var(--ease-fv)] group-hover:scale-[1.06]">
            <Artwork id={item.id} seed={item.seed} ratio="square" label={item.name} />
          </div>
        </div>
      </Link>
      <BookmarkButton
        active={saved}
        onClick={() => toggleBookmark(item)}
        className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
      />
      <div className="p-3">
        <Link to={to}>
          <h3 className="text-[14px] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-[var(--accent)]">
            {item.name}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-ink-mute">{item.series}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.traits.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-md px-1.5 py-0.5 text-[10px] text-ink-dim"
              style={{ background: 'var(--color-raised)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
