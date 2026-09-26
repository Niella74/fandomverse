import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, Outlet } from 'react-router-dom';
import { useStore, useVisitorCount, useClock } from '../lib/store';
import { useJSON } from '../lib/data';

/* Sets --accent for the whole page from the active category, so every
   descendant tints itself without prop-drilling a colour. */
export function useAccent(accentId) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', `var(--color-${accentId || 'anime'})`);
  }, [accentId]);
}

const CATS = [
  ['anime', 'Anime'], ['gaming', 'Gaming'], ['movies', 'Movies'],
  ['tv', 'TV Shows'], ['kpop', 'K-Pop'], ['comics', 'Comics'], ['manga', 'Manga'],
];

const CROSS = [
  ['/search', 'Search'], ['/trailers', 'Trailers'], ['/events', 'Events'],
  ['/merch', 'Merch'], ['/bookmarks', 'Bookmarks'],
];

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" title="FandomVerse home">
      <span className="relative grid size-8 place-items-center">
        <span
          className="absolute inset-0 rounded-lg"
          style={{ background: 'linear-gradient(135deg, var(--accent), transparent 70%)' }}
        />
        <span className="relative font-display text-[15px] font-extrabold text-void">F</span>
      </span>
      <span className="font-display text-[17px] font-extrabold tracking-tight text-ink">
        Fandom<span style={{ color: 'var(--accent)' }}>Verse</span>
      </span>
    </Link>
  );
}

export function Breadcrumbs({ trail }) {
  if (!trail?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-ink-mute">
        <li><Link to="/" className="hover:text-ink">Home</Link></li>
        {trail.map((t, i) => (
          <li key={t.to || t.label} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {i === trail.length - 1 || !t.to ? (
              <span className="text-ink-dim" aria-current="page">{t.label}</span>
            ) : (
              <Link to={t.to} className="hover:text-ink">{t.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function AuthDialog({ mode, onClose }) {
  const { setUser } = useStore();
  const [name, setName] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    setUser({ name: name.trim() || 'Guest' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 grid place-items-center bg-void/85 p-4 backdrop-blur-sm"
      style={{ zIndex: 'var(--z-modal)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6"
      >
        <h2 id="auth-title" className="font-display text-xl font-extrabold text-ink">
          {mode === 'login' ? 'Log in' : 'Create account'}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">
          This is an interface demonstration. FandomVerse has no backend, so nothing you
          type is stored, sent or checked.
        </p>

        <label htmlFor="auth-name" className="mt-4 block font-mono text-[11px] uppercase tracking-wider text-ink-mute">
          Display name
        </label>
        <input
          id="auth-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Guest"
          className="mt-1 w-full rounded-lg border border-line bg-void px-3 py-2 text-sm text-ink outline-none focus:border-[var(--accent)]"
        />

        <label htmlFor="auth-pass" className="mt-3 block font-mono text-[11px] uppercase tracking-wider text-ink-mute">
          Password
        </label>
        <input
          id="auth-pass"
          type="password"
          placeholder="Not checked"
          className="mt-1 w-full rounded-lg border border-line bg-void px-3 py-2 text-sm text-ink outline-none focus:border-[var(--accent)]"
        />

        <div className="mt-5 flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-void"
            style={{ background: 'var(--accent)' }}
          >
            {mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 text-sm text-ink-dim hover:text-ink">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Layout({ onOpenSearch }) {
  const { cartCount, bookmarks, user, setUser } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const loc = useLocation();

  useEffect(() => { setMenuOpen(false); }, [loc.pathname]);
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);

  const navLink = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
      isActive ? 'text-ink' : 'text-ink-dim hover:text-ink'
    }`;

  return (
    <div className="relative flex min-h-screen flex-col" style={{ zIndex: 'var(--z-raised)' }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-raised focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 border-b border-line bg-void/85 backdrop-blur-xl"
        style={{ zIndex: 'var(--z-nav)' }}
      >
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink-dim hover:text-ink lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          <Logo />

          <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Categories">
            {CATS.map(([id, name]) => (
              <NavLink key={id} to={`/c/${id}`} className={navLink}>{name}</NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] text-ink-mute transition-colors duration-200 hover:border-ink-mute hover:text-ink-dim"
              aria-label="Open search"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-line px-1 font-mono text-[10px] sm:inline">⌘K</kbd>
            </button>

            <Link
              to="/bookmarks"
              className="relative grid size-9 place-items-center rounded-lg border border-line text-ink-dim hover:text-ink"
              aria-label={`Bookmarks (${bookmarks.length})`}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 4h12v16l-6-4-6 4V4z" strokeLinejoin="round" />
              </svg>
              {bookmarks.length > 0 && (
                <span
                  className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full font-mono text-[9px] font-bold text-void"
                  style={{ background: 'var(--accent)' }}
                >
                  {bookmarks.length > 9 ? '9+' : bookmarks.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative grid size-9 place-items-center rounded-lg border border-line text-ink-dim hover:text-ink"
              aria-label={`Cart (${cartCount} items)`}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 4h2l2.4 11h10l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full font-mono text-[9px] font-bold text-void"
                  style={{ background: 'var(--accent)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <button
                onClick={() => setUser(null)}
                className="hidden rounded-lg border border-line px-3 py-1.5 text-[13px] text-ink-dim hover:text-ink sm:block"
              >
                {user.name} · Log out
              </button>
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                <button onClick={() => setAuth('login')} className="rounded-lg px-3 py-1.5 text-[13px] text-ink-dim hover:text-ink">
                  Log in
                </button>
                <button
                  onClick={() => setAuth('signup')}
                  className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-void"
                  style={{ background: 'var(--accent)' }}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* cross-category row, always reachable per the brief */}
        <div className="border-t border-line/60">
          <div className="fv-rail mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 py-1.5">
            {CROSS.map(([to, label]) => (
              <NavLink key={to} to={to} className={navLink}>{label}</NavLink>
            ))}
            <NavLink to="/about" className={navLink}>About</NavLink>
            <NavLink to="/contact" className={navLink}>Contact</NavLink>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-line bg-surface lg:hidden">
            <nav className="mx-auto grid max-w-[1400px] grid-cols-2 gap-1 p-3" aria-label="Categories">
              {CATS.map(([id, name]) => (
                <NavLink
                  key={id}
                  to={`/c/${id}`}
                  className="rounded-lg border border-line px-3 py-2 text-sm text-ink-dim"
                  style={{ borderLeftColor: `var(--color-${id})`, borderLeftWidth: 3 }}
                >
                  {name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="main" className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-20 pt-6">
        <Outlet />
      </main>

      <SiteFooter />
      {auth && <AuthDialog mode={auth} onClose={() => setAuth(null)} />}
    </div>
  );
}

function SiteFooter() {
  const visits = useVisitorCount();
  const now = useClock();
  const { data: index } = useJSON('index');

  return (
    <footer className="border-t border-line bg-surface/60">
      <div className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-dim">
              One portal for seven fandom worlds. Every series, character and product here is
              an original invention for this project.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
              Worlds
            </h3>
            <ul className="space-y-1">
              {(index || []).map((c) => (
                <li key={c.id}>
                  <Link to={`/c/${c.id}`} className="flex min-h-6 items-center gap-2 py-0.5 text-[13px] text-ink-dim hover:text-ink">
                    <span className="size-1.5 rounded-full" style={{ background: `var(--color-${c.accent})` }} />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
              Explore
            </h3>
            <ul className="space-y-1">
              {[...CROSS, ['/about', 'About Us'], ['/contact', 'Contact Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="flex min-h-6 items-center py-0.5 text-[13px] text-ink-dim hover:text-ink">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
              Live
            </h3>
            <dl className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-mute">Local time</dt>
                <dd className="font-mono tabular-nums text-ink">
                  {now.toLocaleTimeString('en-GB')}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-mute">Date</dt>
                <dd className="font-mono text-ink">
                  {now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-mute">Visitors</dt>
                <dd className="font-mono tabular-nums text-ink">{visits.toLocaleString('en-GB')}</dd>
              </div>
            </dl>
           
          </div>
        </div>

        <p className="mt-8 border-t border-line pt-5 text-[12px] text-ink-mute">
          FandomVerse — a student project for the Web Innovation Unleashed brief. All franchises,
          characters, events and merchandise shown are fictional and created for this site.
        </p>
      </div>
    </footer>
  );
}
