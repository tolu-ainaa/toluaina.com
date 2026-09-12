// Placeholder thumbnails, rendered at build time. Each card swaps to its poster/loop once media exists.

export function motionGlyph(hue: number, i: number): string {
  const ph = (i * 0.17) % 1;
  const cx = 18 + 124 * ph;
  const cy = 74 - 58 * (1 - Math.pow(1 - ph, 3));
  return `<svg class="glyph" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true">
    <rect width="160" height="90" fill="hsl(${hue} 88% 62%)"/>
    <path d="M18 74 C 60 74, 80 16, 142 16" fill="none" stroke="#15120E" stroke-width="1.4" opacity=".6"/>
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="#15120E"/>
    <line x1="18" y1="74" x2="142" y2="74" stroke="#15120E" stroke-width=".6" opacity=".3"/></svg>`;
}

export function xrGlyph(k: number): string {
  const a = k * 0.6;
  const pts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x, y, z]) => {
    const cx = x * Math.cos(a) - z * Math.sin(a), cz = x * Math.sin(a) + z * Math.cos(a);
    const s = 24 / (cz + 3.2);
    return [80 + cx * s * 3.6, 44 + y * s * 3.2];
  });
  const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const lines = E.map(([p, q]) => `<line x1="${pts[p][0].toFixed(1)}" y1="${pts[p][1].toFixed(1)}" x2="${pts[q][0].toFixed(1)}" y2="${pts[q][1].toFixed(1)}"/>`).join('');
  let floor = '';
  for (let i = 0; i <= 8; i++) floor += `<line x1="${i * 20}" y1="90" x2="${60 + i * 5}" y2="52"/>`;
  for (let j = 0; j < 4; j++) { const y = 52 + j * j * 2.6; floor += `<line x1="0" y1="${y + 3}" x2="160" y2="${y + 3}"/>`; }
  return `<svg class="glyph" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="90" fill="#141C31"/>
    <g stroke="#5D8BFF" stroke-width=".5" opacity=".35">${floor}</g><g stroke="#DCE4F5" stroke-width="1.2" fill="none" stroke-linejoin="round">${lines}</g></svg>`;
}

export function dsGlyph(): string {
  return `<svg class="glyph" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="90" fill="#141C31"/>
    <rect x="14" y="14" width="56" height="62" rx="3" fill="#F6C445"/><circle cx="104" cy="32" r="16" fill="#DCE4F5"/>
    <rect x="84" y="56" width="62" height="20" rx="10" fill="#5D8BFF"/><rect x="24" y="24" width="36" height="6" rx="3" fill="#15120E"/>
    <rect x="24" y="36" width="24" height="6" rx="3" fill="#15120E" opacity=".6"/></svg>`;
}
