import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useJSON, fmtMoney } from '../lib/data';
import { useAccent, Breadcrumbs } from '../components/Layout';
import Artwork from '../components/Artwork';
import { Badge, BookmarkButton, Chip, Empty, Rail, SectionHead, Tabs } from '../components/ui';
import { useStore } from '../lib/store';

const CAT_NAMES = {
  anime: 'Anime', gaming: 'Gaming', movies: 'Movies', tv: 'TV Shows',
  kpop: 'K-Pop', comics: 'Comics', manga: 'Manga',
};

const SORTS = {
  popular: { label: 'Popular', fn: (a, b) => b.popularity - a.popularity },
  low: { label: 'Price ↑', fn: (a, b) => a.price - b.price },
  high: { label: 'Price ↓', fn: (a, b) => b.price - a.price },
  az: { label: 'A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

export function MerchList() {
  useAccent('comics');
  const { data: merch, loading } = useJSON('merch');
  const [cat, setCat] = useState('all');
  const [kind, setKind] = useState('all');
  const [sort, setSort] = useState('popular');
  const { addToCart, isBookmarked, toggleBookmark } = useStore();

  const kinds = useMemo(
    () => [...new Set((merch || []).map((m) => m.kind))].sort(),
    [merch]
  );

  const filtered = useMemo(() => {
    let list = merch || [];
    if (cat !== 'all') list = list.filter((m) => m.catId === cat);
    if (kind !== 'all') list = list.filter((m) => m.kind === kind);
    return [...list].sort(SORTS[sort].fn);
  }, [merch, cat, kind, sort]);

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Merchandise' }]} />

      <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
        Merchandise
      </h1>
      <p className="mt-1 max-w-2xl text-[14px] text-ink-dim">
        Fan goods for the seven worlds. You can browse, open a product and add it to a cart
        that totals correctly — there is deliberately no checkout or payment.
      </p>

      <div className="mt-5 space-y-3">
        <Rail>
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>All worlds</Chip>
          {Object.entries(CAT_NAMES).map(([id, name]) => (
            <Chip key={id} active={cat === id} onClick={() => setCat(id)}>
              <span className="size-1.5 rounded-full" style={{ background: `var(--color-${id})` }} />
              {name}
            </Chip>
          ))}
        </Rail>
        <Rail>
          <Chip active={kind === 'all'} onClick={() => setKind('all')}>All types</Chip>
          {kinds.map((k) => (
            <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{k}</Chip>
          ))}
        </Rail>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tabular-nums text-ink-mute">
            {loading ? 'Loading…' : `${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
          </p>
          <Tabs
            tabs={Object.entries(SORTS).map(([id, s]) => ({ id, label: s.label }))}
            value={sort}
            onChange={setSort}
            className="w-auto"
          />
        </div>
      </div>

      {!loading && filtered.length === 0 ? (
        <Empty title="No products match" hint="Try another world or product type." />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <article
              key={m.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-200 hover:border-[var(--accent)]"
              style={{ '--accent': `var(--color-${m.catId})` }}
            >
              <Link to={`/merch/${m.id}`} className="relative block">
                <div className="aspect-[4/3] overflow-hidden">
                  <div className="size-full transition-transform duration-500 ease-[var(--ease-fv)] group-hover:scale-105">
                    <Artwork id={m.id} seed={m.seed} ratio="wide" label={m.name} />
                  </div>
                </div>
                <div className="absolute left-2 top-2">
                  <Badge>{m.kind}</Badge>
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-3">
                <Link to={`/merch/${m.id}`}>
                  <h2 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink transition-colors group-hover:text-[var(--accent)]">
                    {m.name}
                  </h2>
                </Link>
                <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-ink-mute">
                  {m.blurb}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-display text-[17px] font-extrabold tabular-nums text-ink">
                    {fmtMoney(m.price)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <BookmarkButton active={isBookmarked(m.id)} onClick={() => toggleBookmark(m)} />
                    <button
                      onClick={() => addToCart(m)}
                      className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-void transition-transform duration-200 hover:scale-105"
                      style={{ background: 'var(--accent)' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export function MerchDetail() {
  const { itemId } = useParams();
  const { data: merch, loading } = useJSON('merch');
  const item = useMemo(() => (merch || []).find((m) => m.id === itemId), [merch, itemId]);
  const { addToCart, isBookmarked, toggleBookmark } = useStore();
  const [qty, setQty] = useState(1);
  useAccent(item?.catId);

  const related = useMemo(
    () => (merch || []).filter((m) => m.catId === item?.catId && m.id !== item?.id).slice(0, 4),
    [merch, item]
  );

  if (loading) {
    return <div className="grid min-h-[50vh] place-items-center"><p className="font-mono text-sm text-ink-mute">Loading…</p></div>;
  }
  if (!item) {
    return <Empty title="Product not found" action={<Link to="/merch" className="font-mono text-sm text-ink-dim hover:text-ink">← All merchandise</Link>} />;
  }

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: 'Merchandise', to: '/merch' },
          { label: item.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="aspect-[4/3]">
            <Artwork id={item.id} seed={item.seed} ratio="wide" label={item.name} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{item.kind}</Badge>
            <Link to={`/c/${item.catId}`} className="font-mono text-[11px] text-ink-mute hover:text-ink">
              {CAT_NAMES[item.catId]}
            </Link>
          </div>

          <h1 className="mt-2 text-balance font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[34px]">
            {item.name}
          </h1>

          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink-dim">{item.blurb}</p>

          <p className="mt-5 font-display text-[32px] font-extrabold tabular-nums text-ink">
            {fmtMoney(item.price)}
          </p>
          <p className="mt-1 font-mono text-[11px] text-ink-mute">
            {item.stock} in stock · ships from the fictional warehouse
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-line bg-surface">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center text-ink-dim hover:text-ink"
                aria-label="Decrease quantity"
              >−</button>
              <span className="w-10 text-center font-mono tabular-nums text-ink" aria-live="polite">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="grid size-10 place-items-center text-ink-dim hover:text-ink"
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button
              onClick={() => { for (let i = 0; i < qty; i++) addToCart(item); }}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-void transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: 'var(--accent)' }}
            >
              Add {qty} to cart
            </button>

            <BookmarkButton active={isBookmarked(item.id)} onClick={() => toggleBookmark(item)} />
          </div>

          <p className="mt-4 rounded-lg border border-line bg-surface p-3 text-[12px] leading-relaxed text-ink-mute">
            This is a demonstration storefront. The cart totals correctly, but there is no
            checkout, no payment and no order — by design, and in line with the brief.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <SectionHead eyebrow={CAT_NAMES[item.catId]} title="More from this world" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((m) => (
              <Link
                key={m.id}
                to={`/merch/${m.id}`}
                className="group overflow-hidden rounded-xl border border-line bg-surface"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <div className="size-full transition-transform duration-500 group-hover:scale-105">
                    <Artwork id={m.id} seed={m.seed} ratio="wide" label={m.name} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-[13px] font-semibold text-ink">{m.name}</p>
                  <p className="mt-1 font-mono text-[12px] tabular-nums text-ink-dim">{fmtMoney(m.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
