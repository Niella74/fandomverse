import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback } from 'react';

/* ============================================================
   Persistence rules from the brief:
   - Bookmarks  -> localStorage  (survive between visits)
   - Notes      -> sessionStorage (current browser session only)
   - Cart       -> localStorage  (convenience; no checkout exists)
   Nothing is ever written to a server; there isn't one.
   ============================================================ */

const read = (store, key, fallback) => {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (store, key, value) => {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or quota — the UI still works, it just won't persist */
  }
};

const K = {
  bookmarks: 'fv.bookmarks',
  cart: 'fv.cart',
  notes: 'fv.notes',
  visits: 'fv.visits',
  session: 'fv.session',
  user: 'fv.user',
};

const StoreCtx = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const found = state.find((l) => l.id === action.item.id);
      if (found) {
        return state.map((l) =>
          l.id === action.item.id ? { ...l, qty: Math.min(l.qty + 1, 99) } : l
        );
      }
      return [...state, { id: action.item.id, qty: 1 }];
    }
    case 'qty':
      return state
        .map((l) => (l.id === action.id ? { ...l, qty: Math.max(0, action.qty) } : l))
        .filter((l) => l.qty > 0);
    case 'remove':
      return state.filter((l) => l.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => read(localStorage, K.bookmarks, []));
  const [cart, dispatchCart] = useReducer(cartReducer, undefined, () =>
    read(localStorage, K.cart, [])
  );
  const [notes, setNotes] = useState(() => read(sessionStorage, K.notes, {}));
  const [user, setUser] = useState(() => read(localStorage, K.user, null));

  useEffect(() => write(localStorage, K.bookmarks, bookmarks), [bookmarks]);
  useEffect(() => write(localStorage, K.cart, cart), [cart]);
  useEffect(() => write(sessionStorage, K.notes, notes), [notes]);
  useEffect(() => write(localStorage, K.user, user), [user]);

  const toggleBookmark = useCallback((entry) => {
    setBookmarks((list) => {
      const exists = list.some((b) => b.id === entry.id);
      if (exists) return list.filter((b) => b.id !== entry.id);
      return [
        { id: entry.id, title: entry.title || entry.name, type: entry.type, catId: entry.catId, at: Date.now() },
        ...list,
      ];
    });
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.some((b) => b.id === id), [bookmarks]);

  const setNote = useCallback((id, text) => {
    setNotes((n) => {
      const next = { ...n };
      if (text && text.trim()) next[id] = text;
      else delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      bookmarks, toggleBookmark, isBookmarked, clearBookmarks: () => setBookmarks([]),
      notes, setNote,
      cart,
      addToCart: (item) => dispatchCart({ type: 'add', item }),
      setQty: (id, qty) => dispatchCart({ type: 'qty', id, qty }),
      removeFromCart: (id) => dispatchCart({ type: 'remove', id }),
      clearCart: () => dispatchCart({ type: 'clear' }),
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      user, setUser,
    }),
    [bookmarks, toggleBookmark, isBookmarked, notes, setNote, cart, user]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
};

/* ------------------------------------------------------------
   Visitor counter — simulated locally, as the brief specifies.
   Counts one visit per browser session, total kept in localStorage.
   ------------------------------------------------------------ */
export function useVisitorCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const seen = sessionStorage.getItem(K.session);
    let total = read(localStorage, K.visits, 0);
    if (!seen) {
      // Seeded so a first-time visitor doesn't see "1 visitor".
      if (!total) total = 12840;
      total += 1;
      write(localStorage, K.visits, total);
      sessionStorage.setItem(K.session, '1');
    }
    setCount(total);
  }, []);
  return count;
}

/* Real-time clock, per the brief's UI features list. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}
