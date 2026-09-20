import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Procedural hero backdrop: a slowly rotating "pixel globe" (point cloud on a
 * sphere, drawn as tiny squares with depth fog) plus a scatter of drifting
 * pixel tiles, all on a <canvas>. Sits behind the hero text; readability
 * gradients are layered on top in JSX.
 *
 * - theme-aware: point colour is read from --foreground / --primary each frame
 * - mouse parallax nudges the globe and its rotation
 * - pauses when the hero is offscreen or the tab is hidden
 * - reduced motion: renders one static frame
 */

const ROWS = 124; // latitude rows on the globe
const TILES = 90;

interface Tile {
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  w: number;
  h: number;
  vx: number;
  vy: number;
  a: number; // alpha
  d: number; // depth 0..1 (size/alpha scale)
}

/**
 * Brick-pattern lat/long grid on the unit sphere: rows of tiles along each
 * latitude, alternate rows offset by half a tile, column count shrinking with
 * cos(lat) so tiles stay roughly the same size everywhere.
 */
function brickSphere(rows: number) {
  const pts: number[] = [];
  for (let r = 0; r < rows; r++) {
    const lat = -Math.PI / 2 + ((r + 0.5) / rows) * Math.PI;
    const cosLat = Math.cos(lat);
    const cols = Math.max(1, Math.round((cosLat * rows * 2) / 1.5));
    const offset = (r % 2) * 0.5;
    for (let c = 0; c < cols; c++) {
      const lon = ((c + offset) / cols) * Math.PI * 2;
      pts.push(Math.cos(lon) * cosLat, Math.sin(lat), Math.sin(lon) * cosLat);
    }
  }
  return new Float32Array(pts);
}

/** Cheap 2D value noise (0..1) for continent-like light/dark patches on the sphere. */
function makeNoise() {
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(((Math.sin(i * 9301 + 49297) * 233280) % 1 + 1) % 1 * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  const fade = (t: number) => t * t * (3 - 2 * t);
  const grid = (x: number, y: number) => perm[(perm[x & 255] + y) & 255] / 255;
  const n2 = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const a = grid(xi, yi), b = grid(xi + 1, yi), c = grid(xi, yi + 1), d = grid(xi + 1, yi + 1);
    const u = fade(xf), v = fade(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  // 3 octaves
  return (x: number, y: number) => (n2(x, y) * 0.6 + n2(x * 2.1, y * 2.1) * 0.28 + n2(x * 4.3, y * 4.3) * 0.12);
}

function readHsl(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

export const HeroBackground = ({ className = '' }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const sphere = brickSphere(ROWS);
    const POINTS = sphere.length / 3;
    // Per-point shade from noise over (lat, lon): gives the mosaic its patches.
    const noise = makeNoise();
    const shade = new Float32Array(POINTS);
    // colour class per point: 0 sea, 1 slate, 2 blue, 3 teal, 4 warm spark
    const cls = new Uint8Array(POINTS);
    for (let i = 0; i < POINTS; i++) {
      const x = sphere[i * 3], y = sphere[i * 3 + 1], z = sphere[i * 3 + 2];
      const lat = Math.asin(y), lon = Math.atan2(z, x);
      const n = noise((lon + Math.PI) * 2.4, (lat + Math.PI / 2) * 2.8);
      shade[i] = n;
      cls[i] = n > 0.64 && i % 11 === 0 ? 4 : n > 0.68 ? 3 : n > 0.55 ? 2 : n > 0.42 ? 1 : 0;
    }

    // Draw buckets: 5 classes × ALPHA_STEPS alpha levels. Points are counting-sorted
    // into buckets each frame so we set fillStyle ~100 times, not ~17k times.
    const ALPHA_STEPS = 12;
    const BUCKETS = 5 * ALPHA_STEPS;
    const bucketOf = new Uint8Array(POINTS);
    const order = new Uint32Array(POINTS);
    const counts = new Uint32Array(BUCKETS + 1);
    const screen = new Float32Array(POINTS * 4); // sx, sy, w, h
    const styleCache: string[][] = [[], []]; // [dark, light][bucket]
    const styleFor = (bucket: number, isLight: boolean) => {
      const cache = styleCache[isLight ? 1 : 0];
      if (cache[bucket]) return cache[bucket];
      const c = Math.floor(bucket / ALPHA_STEPS);
      const a = ((bucket % ALPHA_STEPS) + 0.5) / ALPHA_STEPS;
      let css: string;
      switch (c) {
        case 4: css = `hsl(28 90% 60% / ${(a * 0.9).toFixed(3)})`; break;
        case 3: css = isLight ? `hsl(180 40% 26% / ${a.toFixed(3)})` : `hsl(180 45% 56% / ${a.toFixed(3)})`; break;
        case 2: css = isLight ? `hsl(210 45% 30% / ${a.toFixed(3)})` : `hsl(208 50% 52% / ${a.toFixed(3)})`; break;
        case 1: css = isLight ? `hsl(215 18% 38% / ${(a * 0.85).toFixed(3)})` : `hsl(215 18% 50% / ${(a * 0.85).toFixed(3)})`; break;
        default: css = `hsl(${readHsl('--foreground', '0 0% 98%')} / ${(a * (isLight ? 0.55 : 0.4)).toFixed(3)})`;
      }
      cache[bucket] = css;
      return css;
    };
    const seeded = (i: number) => {
      const x = Math.sin(i * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    const tiles: Tile[] = Array.from({ length: TILES }, (_, i) => ({
      x: 0.45 + seeded(i) * 0.6,
      y: 0.05 + seeded(i + 100) * 0.9,
      w: 6 + seeded(i + 200) * 22,
      h: 4 + seeded(i + 300) * 10,
      vx: (seeded(i + 400) - 0.5) * 0.00012,
      vy: (seeded(i + 500) - 0.5) * 0.00008,
      a: 0.15 + seeded(i + 600) * 0.45,
      d: seeded(i + 700),
    }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let visible = true;
    let last = performance.now();
    let angle = 0;
    // pointer parallax, eased
    let px = 0, py = 0, tx = 0, ty = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let lastTheme = '';
    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      const fg = readHsl('--foreground', '0 0% 98%');
      const isLight = document.documentElement.classList.contains('light');
      const themeKey = `${isLight}|${fg}`;
      if (themeKey !== lastTheme) {
        lastTheme = themeKey;
        styleCache[0].length = 0;
        styleCache[1].length = 0;
      }

      // Parallax easing
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;

      // Globe geometry: big, right-of-centre, top slightly cropped like a horizon.
      // Landscape: big sphere right-of-centre. Portrait: an even bigger sphere
      // whose lower-left limb arcs across the top-right, leaving the text dark.
      const portrait = height > width * 1.1;
      const R = portrait ? width * 0.95 : Math.min(width * 0.44, height * 0.78);
      const cx = (portrait ? width * 0.95 : width * 0.74) + px * 40;
      const cy = (portrait ? height * 0.18 : height * 0.52) + py * 24;
      const tilt = -0.5 + py * 0.12; // rotate around X
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const focal = R * 3;

      // Volumetric glow behind the sphere
      const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25);
      glow.addColorStop(0, isLight ? 'hsl(205 40% 45% / 0.10)' : 'hsl(205 60% 55% / 0.16)');
      glow.addColorStop(0.6, isLight ? 'hsl(205 40% 45% / 0.04)' : 'hsl(200 60% 50% / 0.06)');
      glow.addColorStop(1, 'hsl(200 60% 50% / 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Brick size from row spacing (height) and 1.5:1 aspect (width)
      const tileH = ((Math.PI * R) / ROWS) * 0.8;
      const tileW = tileH * 1.5 * 0.84;

      // Pass 1: project + bucket
      counts.fill(0);
      let visibleCount = 0;
      for (let i = 0; i < POINTS; i++) {
        const x0 = sphere[i * 3], y0 = sphere[i * 3 + 1], z0 = sphere[i * 3 + 2];
        const x1 = x0 * cosA - z0 * sinA;
        const z1 = x0 * sinA + z0 * cosA;
        const y = y0 * cosT - z1 * sinT;
        const z = y0 * sinT + z1 * cosT;
        if (z < -0.15) { bucketOf[i] = 255; continue; }

        const scale = focal / (focal - z * R);
        const sx = cx + x1 * R * scale;
        const sy = cy + y * R * scale;
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) { bucketOf[i] = 255; continue; }

        const depth = z > 0 ? z : 0;
        const n = shade[i];
        const lum = (0.2 + depth * 0.8) * (0.3 + n * 0.9);
        const alpha = Math.min(0.9, lum) * (isLight ? 0.8 : 1);
        let step = Math.floor(alpha * ALPHA_STEPS);
        if (step >= ALPHA_STEPS) step = ALPHA_STEPS - 1;
        const b = cls[i] * ALPHA_STEPS + step;
        bucketOf[i] = b;
        counts[b + 1]++;
        visibleCount++;
        screen[i * 4] = sx;
        screen[i * 4 + 1] = sy;
        screen[i * 4 + 2] = tileW * scale;
        screen[i * 4 + 3] = tileH * scale;
      }
      // prefix sums → start offsets
      for (let b = 1; b <= BUCKETS; b++) counts[b] += counts[b - 1];
      for (let i = 0; i < POINTS; i++) {
        const b = bucketOf[i];
        if (b === 255) continue;
        order[counts[b]++] = i;
      }
      // counts[b] is now the END of bucket b; walk buckets in order
      let from = 0;
      for (let b = 0; b < BUCKETS; b++) {
        const to = counts[b];
        if (to > from) {
          ctx.fillStyle = styleFor(b, isLight);
          ctx.beginPath();
          for (let k = from; k < to; k++) {
            const i = order[k] * 4;
            const w = screen[i + 2], h = screen[i + 3];
            ctx.rect(screen[i] - w / 2, screen[i + 1] - h / 2, w, h);
          }
          ctx.fill();
        }
        from = to;
      }
      void visibleCount;

      // Drifting pixel tiles (disintegrating edge)
      for (const t of tiles) {
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        if (t.x < 0.4) t.x = 1.05; else if (t.x > 1.08) t.x = 0.42;
        if (t.y < -0.05) t.y = 1.02; else if (t.y > 1.05) t.y = -0.02;
        const s = 0.6 + t.d * 0.8;
        ctx.fillStyle = `hsl(${fg} / ${t.a * (0.35 + t.d * 0.65) * (isLight ? 0.6 : 1)})`;
        ctx.fillRect(t.x * width + px * 60 * t.d, t.y * height + py * 30 * t.d, t.w * s, t.h * s);
      }
    };

    // Adaptive rate: if a frame costs more than ~10ms (weak GPU / software
    // canvas), render every other rAF. The rotation is slow enough that 30fps
    // is indistinguishable.
    let costAvg = 4;
    let skip = false;
    const frame = (now: number) => {
      raf = 0;
      if (!running || !visible) return;
      if (!reduce) raf = requestAnimationFrame(frame);
      if (skip) { skip = false; return; }
      const dt = Math.min(64, now - last);
      last = now;
      if (!reduce) angle += dt * 0.00006; // ~1 rev / 105 s
      const t0 = performance.now();
      draw(dt);
      costAvg = costAvg * 0.9 + (performance.now() - t0) * 0.1;
      if (costAvg > 10) skip = true;
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (reduce) start(); // re-render the static frame with the new parallax
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) start();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) start();
    };

    resize();
    start();
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} aria-hidden />;
};
