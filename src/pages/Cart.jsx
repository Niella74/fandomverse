import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJSON, fmtMoney } from '../lib/data';
import { useAccent, Breadcrumbs } from '../components/Layout';
import Artwork from '../components/Artwork';
import { Empty } from '../components/ui';
import { useStore } from '../lib/store';

/* Temporary cart. Totals are computed in JS as the brief asks; there is
   no checkout, payment or order step anywhere in the flow. */

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 4.95;

export default function Cart() {
  useAccent('gaming');
  const { data: merch, loading } = useJSON('merch');
  const { cart, setQty, removeFromCart, clearCart } = useStore();

  const lines = useMemo(() => {
    if (!merch) return [];
    return cart
      .map((l) => {
        const product = merch.find((m) => m.id === l.id);
        return product ? { ...product, qty: l.qty, lineTotal: product.price * l.qty } : null;
      })
      .filter(Boolean);
  }, [cart, merch]);

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Cart' }]} />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[38px]">
            Your cart
          </h1>
          <p className="mt-1 text-[14px] text-ink-dim">
            {itemCount === 0 ? 'Nothing here yet.' : `${itemCount} item${itemCount === 1 ? '' : 's'} held in this browser.`}
          </p>
        </div>
        {lines.length > 0 && (
          <button
            onClick={clearCart}
            className="rounded-lg border border-line px-4 py-2 text-sm text-ink-dim transition-colors hover:text-ink"
          >
            Empty cart
          </button>
        )}
      </div>

      {loading ? (
        <p className="font-mono text-sm text-ink-mute">Loading…</p>
      ) : lines.length === 0 ? (
        <Empty
          title="Your cart is empty"
          hint="Browse the merchandise showcase and add something to see the total calculate."
          action={
            <Link
              to="/merch"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-void"
              style={{ background: 'var(--accent)' }}
            >
              Browse merchandise
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ul className="space-y-3">
            {lines.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-3"
                style={{ '--accent': `var(--color-${l.catId})` }}
              >
                <Link to={`/merch/${l.id}`} className="shrink-0">
                  <div className="h-16 w-20 overflow-hidden rounded-lg border border-line">
                    <Artwork id={l.id} seed={l.seed} ratio="wide" label={l.name} />
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={`/merch/${l.id}`}>
                    <p className="line-clamp-1 text-[14px] font-semibold text-ink hover:text-[var(--accent)]">
                      {l.name}
                    </p>
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-ink-mute">
                    {l.kind} · {fmtMoney(l.price)} each
                  </p>
                </div>

                <div className="flex items-center rounded-lg border border-line">
                  <button
                    onClick={() => setQty(l.id, l.qty - 1)}
                    className="grid size-9 place-items-center text-ink-dim hover:text-ink"
                    aria-label={`Decrease quantity of ${l.name}`}
                  >−</button>
                  <span className="w-9 text-center font-mono text-sm tabular-nums text-ink">{l.qty}</span>
                  <button
                    onClick={() => setQty(l.id, l.qty + 1)}
                    className="grid size-9 place-items-center text-ink-dim hover:text-ink"
                    aria-label={`Increase quantity of ${l.name}`}
                  >+</button>
                </div>

                <span className="w-20 text-right font-display text-[16px] font-extrabold tabular-nums text-ink">
                  {fmtMoney(l.lineTotal)}
                </span>

                <button
                  onClick={() => removeFromCart(l.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-ink-mute transition-colors hover:text-ink"
                  aria-label={`Remove ${l.name}`}
                >✕</button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-[17px] font-extrabold text-ink">Summary</h2>

            <dl className="mt-4 space-y-2.5 text-[14px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-dim">Subtotal</dt>
                <dd className="font-mono tabular-nums text-ink">{fmtMoney(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-dim">Shipping</dt>
                <dd className="font-mono tabular-nums text-ink">
                  {shipping === 0 ? 'Free' : fmtMoney(shipping)}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="text-[12px] leading-relaxed text-ink-mute">
                  Add {fmtMoney(SHIPPING_THRESHOLD - subtotal)} more for free shipping.
                </p>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-display text-[22px] font-extrabold tabular-nums text-ink">
                  {fmtMoney(total)}
                </dd>
              </div>
            </dl>

            <button
              disabled
              className="mt-5 w-full cursor-not-allowed rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-mute"
              title="Checkout is intentionally not implemented"
            >
              Checkout unavailable
            </button>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-mute">
              This storefront is a demonstration. Totals calculate for real, but no order is
              ever placed and no payment details are collected.
            </p>

            <Link
              to="/merch"
              className="mt-4 block text-center font-mono text-[11px] text-ink-mute hover:text-ink"
            >
              ← Continue browsing
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
