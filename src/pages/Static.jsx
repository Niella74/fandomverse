import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccent, Breadcrumbs } from '../components/Layout';
import { useClock } from '../lib/store';
import { Empty, SectionHead } from '../components/ui';

/* About, Contact and the 404. Grouped because each is a single short page. */

const TEAM = [
  ['Project lead & front-end', 'Designed the token system and built the routing, hubs and search.'],
  ['Content & data design', 'Authored the seven invented universes and the JSON schema behind them.'],
  ['Interaction & accessibility', 'Keyboard navigation, focus states, contrast and the Lighthouse pass.'],
];

const STACK = [
  ['React 19', 'Component model for seven hubs sharing one card system.'],
  ['Vite', 'Build tooling and the static output that deploys anywhere.'],
  ['Tailwind CSS 4', 'Utility styling driven by CSS custom properties.'],
  ['React Router', 'Client-side routing for the single-page architecture.'],
  ['Static JSON', 'The entire content layer. Read-only, exactly as the brief requires.'],
];

const DECISIONS = [
  [
    'Colour identifies the world',
    'Each of the seven categories owns an accent hue, set once on the root element as --accent. Every card, badge and button reads that variable, so a hub tints itself without any component needing to know which category it is inside.',
  ],
  [
    'Artwork comes from two places',
    'Covers and banners are public-domain works from museum open-access collections, each checked for public-domain status and credited in the project documentation. Character portraits are composed in the browser from a numeric seed instead, so that no real person stands in for an invented character. The same seed always yields the same image, which keeps a series looking consistent on every page it appears on.',
  ],
  [
    'Storage matches the requirement exactly',
    'Bookmarks persist in localStorage. Notes use sessionStorage, so they genuinely clear when the tab closes. The cart persists for convenience but has no checkout path at all.',
  ],
  [
    'The assistant answers from a written script',
    'Verse matches what you type against a rule set kept in JSON, and says as much in its own interface. Nothing leaves the page and no service is called, which is what keeps the site entirely static.',
  ],
];

export function About() {
  useAccent('kpop');

  return (
    <>
      <Breadcrumbs trail={[{ label: 'About Us' }]} />

      <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[40px]">
        About FandomVerse
      </h1>
      <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.7] text-ink-dim">
        FandomVerse is a single portal for seven fandom worlds. Fans normally have to move
        between wikis, storefronts, video platforms and news sites to follow one interest.
        This site gathers articles, characters, galleries, media, events, releases and
        merchandise for every category into one consistent place.
      </p>

     
      <section className="mt-12">
        <SectionHead eyebrow="Important" title="Everything here is invented" />
        <p className="max-w-[62ch] text-[15px] leading-[1.7] text-ink-dim">
          Every series, film, group, comic, character, event and product on this site was
          written for the project. No real franchise, studio or performer appears anywhere.
          Cover artwork is drawn from museum open-access collections of public-domain works,
          and character portraits are composed in the browser rather than photographed. This
          keeps the site inside the brief’s requirement that only original or royalty-free
          content be used.
        </p>
      </section>

      <section className="mt-12">
        <SectionHead eyebrow="How it was built" title="Design decisions" />
        <div className="grid gap-4 sm:grid-cols-2">
          {DECISIONS.map(([title, body]) => (
            <article key={title} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-display text-[16px] font-bold text-ink">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead eyebrow="Technology" title="Stack" />
        <dl className="overflow-hidden rounded-xl border border-line bg-surface">
          {STACK.map(([name, why], i) => (
            <div
              key={name}
              className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-6 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <dt className="w-40 shrink-0 font-mono text-[12px] font-semibold text-ink">{name}</dt>
              <dd className="text-[14px] text-ink-dim">{why}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <SectionHead eyebrow="Who built it" title="The team" />
        <div className="grid gap-4 sm:grid-cols-3">
          {TEAM.map(([role, what]) => (
            <article key={role} className="rounded-xl border border-line bg-surface p-5">
              <div
                className="mb-3 size-10 rounded-lg"
                style={{ background: 'linear-gradient(135deg, var(--accent), transparent)' }}
              />
              <h3 className="font-display text-[15px] font-bold text-ink">{role}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">{what}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function Contact() {
  useAccent('comics');
  const now = useClock();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const field =
    'mt-1 w-full rounded-lg border border-line bg-void px-3 py-2.5 text-[14px] text-ink outline-none focus:border-[var(--accent)]';
  const label = 'block font-mono text-[11px] uppercase tracking-wider text-ink-mute';

  return (
    <>
      <Breadcrumbs trail={[{ label: 'Contact Us' }]} />

      <h1 className="font-display text-[30px] font-extrabold leading-tight text-ink sm:text-[40px]">
        Contact us
      </h1>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-dim">
        Questions about the project, the invented universes, or how something was built.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          {sent ? (
            <div className="rounded-xl border border-line bg-surface p-8 text-center">
              <div
                className="mx-auto mb-4 grid size-12 place-items-center rounded-full"
                style={{ background: 'color-mix(in oklab, var(--color-live) 20%, transparent)' }}
              >
                <span style={{ color: 'var(--color-live)' }}>✓</span>
              </div>
              <h2 className="font-display text-[18px] font-bold text-ink">Message noted</h2>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-dim">
                Nothing was actually sent. FandomVerse has no backend, so this form validates
                and confirms locally without transmitting or storing anything.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: 'General', message: '' }); }}
                className="mt-5 rounded-lg border border-line px-4 py-2 text-sm text-ink-dim hover:text-ink"
              >
                Write another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 rounded-xl border border-line bg-surface p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>Your name</label>
                  <input
                    id="c-name" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={field} autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>Email</label>
                  <input
                    id="c-email" type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={field} autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-subject" className={label}>Subject</label>
                <select
                  id="c-subject" value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={field}
                >
                  {['General', 'About the project', 'A bug', 'Content suggestion'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="c-message" className={label}>Message</label>
                <textarea
                  id="c-message" required rows={6} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${field} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg px-5 py-3 text-sm font-semibold text-void transition-transform duration-200 hover:scale-[1.01]"
                style={{ background: 'var(--accent)' }}
              >
                Send message
              </button>
              <p className="text-[12px] leading-relaxed text-ink-mute">
                This form is a demonstration. Nothing you type is stored, sent or collected.
              </p>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-[16px] font-bold text-ink">Where we are</h2>
            <dl className="mt-3 space-y-2.5 text-[13px]">
              {[
                ['Studio', 'Aptech Learning Centre'],
                ['Project', 'Web Innovation Unleashed'],
                ['Local time', now.toLocaleTimeString('en-GB')],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <dt className="text-ink-mute">{k}</dt>
                  <dd className="font-mono tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Map placeholder drawn locally — an external embed would break the
              offline, no-third-party constraint the rest of the site keeps. */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="relative aspect-[4/3]">
              <svg viewBox="0 0 400 300" className="size-full" role="img" aria-label="Stylised map showing the studio location">
                <rect width="400" height="300" fill="var(--color-void)" />
                {[...Array(9)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 34 + 12} x2="400" y2={i * 34 + 12}
                    stroke="var(--color-line)" strokeWidth="1" />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 34 + 10} y1="0" x2={i * 34 + 10} y2="300"
                    stroke="var(--color-line)" strokeWidth="1" />
                ))}
                <path d="M0 190 L140 150 L260 175 L400 130" fill="none"
                  stroke="var(--accent)" strokeWidth="2.5" opacity="0.5" />
                <path d="M190 0 L175 120 L205 200 L190 300" fill="none"
                  stroke="var(--accent)" strokeWidth="2.5" opacity="0.5" />
                <circle cx="195" cy="150" r="26" fill="var(--accent)" opacity="0.14" />
                <circle cx="195" cy="150" r="7" fill="var(--accent)" />
                <text x="195" y="188" textAnchor="middle" fill="var(--color-ink-dim)"
                  fontFamily="monospace" fontSize="11">Studio</text>
              </svg>
            </div>
            <p className="border-t border-line p-3 text-[12px] leading-relaxed text-ink-mute">
              Drawn in SVG rather than embedded, so the page loads no third-party scripts and
              works offline.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export function NotFound() {
  useAccent('anime');
  return (
    <div className="py-16">
      <Empty
        title="That page doesn't exist"
        hint="The link may be wrong, or the page may have moved."
        action={
          <Link
            to="/"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-void"
            style={{ background: 'var(--accent)' }}
          >
            Back to home
          </Link>
        }
      />
    </div>
  );
}
