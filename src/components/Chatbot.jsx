import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJSON } from '../lib/data';

/* ============================================================
   "Verse" — the site guide.
   Rule-based by design: responses come from public/data/chatbot.json
   and are matched on keyword overlap. No external service and no
   network call, which is what the brief's no-backend constraint requires.
   ============================================================ */

function matchRule(text, rules) {
  const t = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const rule of rules) {
    let score = 0;
    for (const k of rule.k) if (t.includes(k)) score += k.length;
    if (score > bestScore) { bestScore = score; best = rule; }
  }
  return bestScore > 0 ? best : null;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const { data: kb } = useJSON('chatbot');
  const navigate = useNavigate();
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (kb && log.length === 0) {
      setLog([{ from: 'bot', text: kb.greeting }]);
    }
  }, [kb, log.length]);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [log, open, typing]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const ask = (text) => {
    if (!text.trim() || !kb) return;
    setLog((l) => [...l, { from: 'you', text }]);
    setDraft('');
    setTyping(true);

    // A short delay so the exchange reads as a conversation rather than a lookup
    setTimeout(() => {
      const rule = matchRule(text, kb.rules);
      setTyping(false);
      setLog((l) => [
        ...l,
        rule
          ? { from: 'bot', text: rule.a, to: rule.to }
          : { from: 'bot', text: kb.fallback },
      ]);
    }, 420);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 grid size-14 place-items-center rounded-full border border-line shadow-2xl transition-transform duration-200 hover:scale-105"
        style={{
          zIndex: 'var(--z-toast)',
          background: 'linear-gradient(140deg, var(--accent), var(--color-raised))',
        }}
      >
        {open ? (
          <span className="text-xl text-void">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" className="size-6 text-void" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a8 8 0 1 1-3.2-6.4" strokeLinecap="round" />
            <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="13" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 flex max-h-[70vh] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          style={{ zIndex: 'var(--z-toast)' }}
          role="dialog"
          aria-label="FandomVerse assistant"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span className="size-2 rounded-full" style={{ background: 'var(--color-live)' }} />
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-ink">Verse</p>
              <p className="font-mono text-[10px] text-ink-mute">Site guide · scripted responses</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {log.map((m, i) => (
              <div key={i} className={m.from === 'you' ? 'flex justify-end' : ''}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.from === 'you' ? 'text-void' : 'border border-line bg-raised text-ink-dim'
                  }`}
                  style={m.from === 'you' ? { background: 'var(--accent)' } : undefined}
                >
                  {m.text}
                  {m.to && (
                    <button
                      onClick={() => { navigate(m.to); setOpen(false); }}
                      className="mt-2 block rounded-lg border border-line px-2.5 py-1 font-mono text-[11px] text-ink transition-colors hover:border-ink-mute"
                    >
                      Take me there →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 px-1" aria-label="Verse is typing">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-ink-mute"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {kb && (
            <div className="fv-rail flex gap-1.5 overflow-x-auto border-t border-line px-3 py-2">
              {kb.quick.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="whitespace-nowrap rounded-full border border-line px-3 py-1 text-[11px] text-ink-dim transition-colors hover:text-ink"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); ask(draft); }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <label htmlFor="chat-input" className="sr-only">Ask Verse a question</label>
            <input
              id="chat-input"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about a category, bookmarks, the cart…"
              className="w-full rounded-lg border border-line bg-void px-3 py-2 text-[13px] text-ink outline-none focus:border-[var(--accent)]"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-void disabled:opacity-40"
              style={{ background: 'var(--accent)' }}
              aria-label="Send"
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}
