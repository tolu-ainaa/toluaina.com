// Canvas stand-ins for the fork's background loops. Once real video files exist these are not rendered.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function sizeCanvas(c: HTMLCanvasElement) {
  const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
  c.width = Math.max(1, r.width * d); c.height = Math.max(1, r.height * d);
  return d;
}

/* ---------- Motion side: easing rows and a curve that draws itself ---------- */
const easings = [
  { n: 'linear', f: (t: number) => t },
  { n: 'ease-out cubic', f: (t: number) => 1 - Math.pow(1 - t, 3) },
  { n: 'ease-in-out', f: (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 },
  { n: 'elastic', f: (t: number) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1 },
  { n: 'back', f: (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2) },
];

function drawMotion(cm: HTMLCanvasElement, gm: CanvasRenderingContext2D, now: number) {
  const d = sizeCanvas(cm), W = cm.width / d, H = cm.height / d;
  gm.setTransform(d, 0, 0, d, 0, 0); gm.clearRect(0, 0, W, H);
  const period = 2600, hold = 500, t = Math.min(1, (now % (period + hold)) / period);
  const small = W < 600, short = H < 680;
  const graph = !(small || short || W < 640);
  const rows = (small || short) ? easings.slice(0, 4) : easings;
  const x0 = small ? 24 : W * .12, x1 = small ? W - 24 : (graph ? W * .52 : W * .88);
  const top = small ? H * .18 : Math.max(H * .18, 205);   // clear of the header and the two meta lines
  const rowGap = small ? Math.min(46, (H * .30) / rows.length) : Math.min(64, (H * .34) / rows.length);
  gm.font = '11px "JetBrains Mono", monospace';
  rows.forEach((e, i) => {
    const y = top + i * rowGap;
    gm.strokeStyle = 'rgba(21,18,14,.28)'; gm.lineWidth = 1; gm.beginPath(); gm.moveTo(x0, y); gm.lineTo(x1, y); gm.stroke();
    gm.fillStyle = 'rgba(21,18,14,.7)'; gm.fillText(e.n, x0, y - 9);
    gm.fillStyle = '#15120E'; gm.beginPath(); gm.arc(x0 + (x1 - x0) * e.f(t), y, 7, 0, Math.PI * 2); gm.fill();
  });
  if (!graph) return;
  const gw = Math.min(W * .28, 260), gh = Math.min(H * .2, 160), gx = W - gw - W * .12, gy = top + gh;
  gm.strokeStyle = 'rgba(21,18,14,.35)'; gm.lineWidth = 1; gm.strokeRect(gx, gy - gh, gw, gh);
  gm.strokeStyle = '#15120E'; gm.lineWidth = 2; gm.beginPath();
  const steps = Math.floor(120 * t);
  for (let s = 0; s <= steps; s++) {
    const u = s / 120, v = easings[3].f(u);
    const X = gx + u * gw, Y = gy - v * gh * .78 - gh * .1;
    s === 0 ? gm.moveTo(X, Y) : gm.lineTo(X, Y);
  }
  gm.stroke();
  gm.fillStyle = 'rgba(21,18,14,.7)'; gm.fillText('t → value  ·  cubic-bezier(.2,.8,.2,1)', gx, gy + 16);
}

/* ---------- XR side: scrolling floor grid, wireframe cube, controller ray ---------- */
let horizon = .58;
function project(p: number[], W: number, H: number, fov: number): [number, number] {
  const s = fov / (p[2] + fov);
  return [W / 2 + p[0] * s, H * horizon + p[1] * s];
}

function drawXR(cx: HTMLCanvasElement, gx: CanvasRenderingContext2D, now: number) {
  const d = sizeCanvas(cx), W = cx.width / d, H = cx.height / d;
  gx.setTransform(d, 0, 0, d, 0, 0); gx.clearRect(0, 0, W, H);
  const small = W < 600, short = H < 680;
  horizon = small ? .40 : (short ? .50 : .58);
  const fov = Math.max(W, H) * .9, T = now / 1000;
  gx.strokeStyle = 'rgba(93,139,255,.32)'; gx.lineWidth = 1;
  const cell = 120, depth = 14, floorY = 180, off = (T * 60) % cell;
  for (let i = -10; i <= 10; i++) {
    const a = project([i * cell, floorY, 0], W, H, fov), b = project([i * cell, floorY, depth * cell], W, H, fov);
    gx.beginPath(); gx.moveTo(a[0], a[1]); gx.lineTo(b[0], b[1]); gx.stroke();
  }
  for (let j = 0; j <= depth; j++) {
    const z = j * cell - off; if (z < 0) continue;
    const a = project([-10 * cell, floorY, z], W, H, fov), b = project([10 * cell, floorY, z], W, H, fov);
    gx.globalAlpha = 1 - j / depth; gx.beginPath(); gx.moveTo(a[0], a[1]); gx.lineTo(b[0], b[1]); gx.stroke();
  }
  gx.globalAlpha = 1;
  const size = Math.min(W, H) * (small ? .13 : .16), ay = T * .6, ax = Math.sin(T * .4) * .5;
  const verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x, y, z]) => {
    const X = x * size, Y = y * size, Z = z * size;
    const X2 = X * Math.cos(ay) - Z * Math.sin(ay), Z2 = X * Math.sin(ay) + Z * Math.cos(ay);
    const Y2 = Y * Math.cos(ax) - Z2 * Math.sin(ax), Z3 = Y * Math.sin(ax) + Z2 * Math.cos(ax);
    return project([X2, Y2 - size * .9 + Math.sin(T * 1.3) * 8, Z3 + size * 2.4], W, H, fov);
  });
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  gx.strokeStyle = '#DCE4F5'; gx.lineWidth = 1.5; gx.lineJoin = 'round';
  edges.forEach(([p, q]) => { gx.beginPath(); gx.moveTo(verts[p][0], verts[p][1]); gx.lineTo(verts[q][0], verts[q][1]); gx.stroke(); });
  gx.fillStyle = '#5D8BFF'; verts.forEach(v => { gx.beginPath(); gx.arc(v[0], v[1], 2.2, 0, Math.PI * 2); gx.fill(); });
  const cxp = W / 2 + Math.sin(T * .7) * W * .05, cyp = H * (small ? .30 : .5) + Math.cos(T * .9) * H * .03;
  gx.strokeStyle = 'rgba(93,139,255,.9)'; gx.lineWidth = 1;
  gx.beginPath(); gx.moveTo(W * .78, H * .96); gx.lineTo(cxp, cyp); gx.stroke();
  gx.beginPath(); gx.arc(cxp, cyp, 9, 0, Math.PI * 2); gx.stroke();
  gx.beginPath(); gx.arc(cxp, cyp, 1.8, 0, Math.PI * 2); gx.fillStyle = '#fff'; gx.fill();
  if (small || short) return;
  gx.fillStyle = 'rgba(220,228,245,.7)'; gx.font = '11px "JetBrains Mono", monospace';
  const hud = `${72 + Math.round(Math.sin(T * 2) * 0.4)} Hz   6DoF   ${(11.2 + Math.sin(T) * .3).toFixed(1)} ms frame`;
  gx.fillText(hud, W - gx.measureText(hud).width - 40, 100);
}

export function startForkCanvases() {
  const cm = document.getElementById('cv-motion') as HTMLCanvasElement | null;
  const cx = document.getElementById('cv-xr') as HTMLCanvasElement | null;
  const gm = cm?.getContext('2d'), gx = cx?.getContext('2d');
  if (!cm && !cx) return;
  const frame = (now: number) => {
    if (cm && gm) drawMotion(cm, gm, now);
    if (cx && gx) drawXR(cx, gx, now);
    if (!reduce) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  addEventListener('resize', () => { if (reduce) frame(performance.now()); });
}
