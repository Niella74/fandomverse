import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import Layout from './components/Layout';
import CommandPalette from './components/CommandPalette';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
const Category = lazy(() => import('./pages/Category'));
const Article = lazy(() => import('./pages/Article'));
const CharacterPage = lazy(() => import('./pages/Character'));
const Search = lazy(() => import('./pages/Search'));
const Trailers = lazy(() => import('./pages/Trailers'));
const Events = lazy(() => import('./pages/Events'));
const MerchList = lazy(() => import('./pages/Merch').then((m) => ({ default: m.MerchList })));
const MerchDetail = lazy(() => import('./pages/Merch').then((m) => ({ default: m.MerchDetail })));
const Cart = lazy(() => import('./pages/Cart'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const About = lazy(() => import('./pages/Static').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Static').then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import('./pages/Static').then((m) => ({ default: m.NotFound })));

/* HashRouter is deliberate: the build is a folder of static files with no
   server to rewrite routes, so hash paths work when opened from disk or
   dropped on any static host. */

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      // "/" opens search too, unless the visitor is typing in a field
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <StoreProvider>
      <HashRouter>
        <Suspense fallback={
          <div className="grid min-h-[60vh] place-items-center">
            <p className="font-mono text-sm text-ink-mute">Loading…</p>
          </div>
        }>
        <Routes>
          <Route element={<Layout onOpenSearch={() => setPaletteOpen(true)} />}>
            <Route index element={<Home />} />
            <Route path="c/:catId" element={<Category />} />
            <Route path="c/:catId/article/:itemId" element={<Article />} />
            <Route path="c/:catId/character/:itemId" element={<CharacterPage />} />
            <Route path="search" element={<Search />} />
            <Route path="trailers" element={<Trailers />} />
            <Route path="events" element={<Events />} />
            <Route path="merch" element={<MerchList />} />
            <Route path="merch/:itemId" element={<MerchDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </Suspense>

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <Chatbot />
      </HashRouter>
    </StoreProvider>
  );
}
