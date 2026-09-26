import { useMemo } from 'react';

/* ============================================================
   Procedural cover artwork, drawn in code.
   Every invented property needs artwork, and the brief allows only
   original material — so each poster is composed from its own seed
   rather than fetched. The same seed always yields the same image, so
   a series looks identical everywhere it appears on the site.

   Three families, chosen by seed:
     0  strata  — horizontal bands, like a coastline or a core sample
     1  orbit   — concentric arcs around an off-centre focus
     2  lattice — a grid of marks with a drifting density
   ============================================================ */

function mulberry(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PosterArt({ seed = 1, className = '', ratio = 'tall', label = '' }) {
  const art = useMemo(() => {
    const rnd = mulberry(seed);
    const family = Math.floor(rnd() * 3);
    const W = 300;
    const H = ratio === 'wide' ? 170 : ratio === 'square' ? 300 : 450;
    const parts = [];

    // Hue drift keeps every poster distinct while staying in the accent family
    const drift = Math.floor(rnd() * 40) - 20;

    if (family === 0) {
      let y = 0;
      while (y < H) {
        const h = 6 + rnd() * (H / 9);
        const o = 0.20 + rnd() * 0.55;
        parts.push(
          <rect key={`s${y}`} x="0" y={y.toFixed(1)} width={W} height={h.toFixed(1)}
            fill="var(--art)" opacity={o.toFixed(2)} />
        );
        y += h + 2 + rnd() * 7;
      }
      const hy = rnd() * H * 0.7 + H * 0.1;
      parts.push(
        <rect key="hl" x="0" y={hy.toFixed(1)} width={W} height="2.5"
          fill="var(--art)" opacity="0.95" />
      );
    } else if (family === 1) {
      const cx = W * (0.25 + rnd() * 0.5);
      const cy = H * (0.25 + rnd() * 0.5);
      const rings = 10 + Math.floor(rnd() * 8);
      for (let i = 0; i < rings; i++) {
        const r = (i + 1) * (Math.max(W, H) / rings) * (0.35 + rnd() * 0.3);
        parts.push(
          <circle key={`o${i}`} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r={r.toFixed(1)}
            fill="none" stroke="var(--art)" strokeWidth={(1.1 + rnd() * 2.6).toFixed(2)}
            opacity={(0.28 + rnd() * 0.55).toFixed(2)} />
        );
      }
      parts.push(
        <circle key="core" cx={cx.toFixed(1)} cy={cy.toFixed(1)}
          r={(5 + rnd() * 12).toFixed(1)} fill="var(--art)" opacity="0.9" />
      );
    } else {
      const cols = 6 + Math.floor(rnd() * 5);
      const rows = Math.round((cols * H) / W);
      const cw = W / cols;
      const ch = H / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bias = 1 - r / rows;
          if (rnd() > 0.45 + bias * 0.45) continue;
          const pad = cw * (0.1 + rnd() * 0.3);
          parts.push(
            <rect key={`l${r}-${c}`}
              x={(c * cw + pad).toFixed(1)} y={(r * ch + pad).toFixed(1)}
              width={Math.max(1, cw - pad * 2).toFixed(1)}
              height={Math.max(1, ch - pad * 2).toFixed(1)}
              rx="1.5" fill="var(--art)" opacity={(0.22 + rnd() * 0.6).toFixed(2)} />
          );
        }
      }
    }

    return { W, H, parts, drift, family };
  }, [seed, ratio]);

  return (
    <svg
      viewBox={`0 0 ${art.W} ${art.H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ? `Cover artwork for ${label}` : 'Cover artwork'}
      style={{
        '--art': `color-mix(in oklab, var(--accent) ${70 + art.drift}%, white)`,
        display: 'block',
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(160deg, color-mix(in oklab, var(--accent) 34%, #0A0910), color-mix(in oklab, var(--accent) 8%, #0A0910) 78%)',
      }}
    >
      {art.parts}
    </svg>
  );
}
