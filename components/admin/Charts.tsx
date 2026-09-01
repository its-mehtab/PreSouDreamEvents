"use client";

// Smooth line generator for monotonic X (no overshoot)
function smoothLine(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cp1x = (p1.x + p2.x) / 2;
    const cp2x = (p1.x + p2.x) / 2;
    d += ` C ${cp1x},${p1.y} ${cp2x},${p2.y} ${p2.x},${p2.y}`;
  }
  return d;
}

// Tiny SVG sparkline — no deps
export function SparkLine({
  data,
  color = "#7c3aed",
  fill = false,
}: {
  data: number[];
  color?: string;
  fill?: boolean;
}) {
  if (!data || data.length < 2) return null;
  const w = 100;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return { x, y };
  });

  const pathD = smoothLine(pts);
  const fillD = `${pathD} L ${w},${h} L 0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-20 h-9"
      preserveAspectRatio="none"
    >
      {fill && (
        <path
          d={fillD}
          fill={color}
          fillOpacity={0.15}
        />
      )}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Area chart for Revenue Overview
export function AreaChart({
  data,
  color = "#7c3aed",
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  if (!data || data.length < 2) return null;
  const w = 400;
  const h = 120;
  const padL = 40;
  const padB = 24;
  const innerW = w - padL;
  const innerH = h - padB;

  const values = data.map((d) => d.value);
  const min = 0;
  const max = Math.max(...values, 1);

  const pts = data.map((d, i) => {
    const x = padL + (i / (data.length - 1)) * innerW;
    const y = innerH - ((d.value - min) / (max - min)) * innerH;
    return { x, y, ...d };
  });

  const pathD = smoothLine(pts);
  const fillD = `${pathD} L ${pts[pts.length - 1].x},${innerH} L ${pts[0].x},${innerH} Z`;

  // Y-axis ticks
  const yTicks = [0, 10000, 20000, 30000, 40000, 50000].filter((t) => t <= max * 1.1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Y gridlines */}
      {yTicks.map((t) => {
        const y = innerH - ((t - min) / (max - min)) * innerH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={w} y2={y} stroke="#e5e7eb" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={padL - 4} y={y + 3} textAnchor="end" fontSize={7} fill="#9ca3af">
              {t >= 1000 ? `₹${t / 1000}K` : "₹0"}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={fillD} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* X labels */}
      {pts.map((p) => (
        <text key={p.label} x={p.x} y={h - 4} textAnchor="middle" fontSize={7} fill="#9ca3af">
          {p.label}
        </text>
      ))}

      {/* End dot */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={3} fill={color} />
    </svg>
  );
}
