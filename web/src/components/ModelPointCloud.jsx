import { useMemo, useState } from "react";

const MODELS = [
  {
    id: "splatfacto",
    name: "Splatfacto",
    psnr: 20.25,
    ssim: 0.712,
    lpips: 0.337,
    trainTimeMin: 9.45,
    peakGpuGb: 2.21,
    numGaussians: 312426,
    fileSizeMb: 77.5,
  },
  {
    id: "inria_3dgs",
    name: "Inria 3DGS",
    psnr: 19.38,
    ssim: 0.683,
    lpips: 0.381,
    trainTimeMin: 24.26,
    peakGpuGb: 8.94,
    numGaussians: 578669,
    fileSizeMb: 143.5,
  },
  {
    id: "mip_splatting",
    name: "Mip-Splatting",
    psnr: 19.40,
    ssim: 0.679,
    lpips: 0.385,
    trainTimeMin: 9.80,
    peakGpuGb: 16.75,
    numGaussians: 699425,
    fileSizeMb: 176.3,
  },
];

const METRICS = [
  { key: "psnr",          label: "PSNR",        unit: " dB", higherBetter: true,  decimals: 2 },
  { key: "ssim",          label: "SSIM",        unit: "",    higherBetter: true,  decimals: 3 },
  { key: "lpips",         label: "LPIPS",       unit: "",    higherBetter: false, decimals: 3 },
  { key: "trainTimeMin",  label: "Train time",  unit: " min", higherBetter: false, decimals: 2 },
  { key: "peakGpuGb",     label: "Peak GPU",    unit: " GB", higherBetter: false, decimals: 2 },
  { key: "numGaussians",  label: "Gaussians",   unit: "",    higherBetter: false, decimals: 0 },
  { key: "fileSizeMb",    label: ".ply size",   unit: " MB", higherBetter: false, decimals: 1 },
];

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(rng) {
  const u1 = Math.max(rng(), 1e-10);
  const u2 = rng();
  const r = Math.sqrt(-2 * Math.log(u1));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

function heatScore(model, metric) {
  const values = MODELS.map((m) => m[metric.key]).filter((v) => typeof v === "number");
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 0.5;
  const v = model[metric.key];
  const norm = (v - min) / (max - min);
  return metric.higherBetter ? norm : 1 - norm;
}

function compositeScore(model) {
  const qualityMetrics = METRICS.filter((m) =>
    ["psnr", "ssim", "lpips", "trainTimeMin", "peakGpuGb", "fileSizeMb"].includes(m.key)
  );
  const sum = qualityMetrics.reduce((acc, m) => acc + heatScore(model, m), 0);
  return sum / qualityMetrics.length;
}

function heatColor(score, alpha = 1) {
  const hue = score * 130;
  return `hsla(${hue.toFixed(1)}, 78%, 50%, ${alpha})`;
}

function formatValue(v, metric) {
  if (typeof v !== "number") return "—";
  if (metric.key === "numGaussians") return v.toLocaleString();
  return v.toFixed(metric.decimals) + metric.unit;
}

function HeatmapMatrix({ activeMetricKey, onPickMetric }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
      <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
        <h3 className="font-semibold text-gray-900">Performance Heatmap</h3>
        <span className="text-xs text-gray-500">
          Green = best for that column · Red = worst. Click a column to color the point cloud below.
        </span>
      </div>
      <table className="w-full text-sm border-separate" style={{ borderSpacing: 4 }}>
        <thead>
          <tr>
            <th className="text-left text-xs font-medium text-gray-500 px-2 py-1">Model</th>
            {METRICS.map((m) => {
              const isActive = m.key === activeMetricKey;
              return (
                <th
                  key={m.key}
                  className={`text-right text-xs font-medium px-2 py-1 cursor-pointer rounded transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => onPickMetric(m.key)}
                  title={`Color point cloud by ${m.label}`}
                >
                  {m.label}
                  <span className="ml-1 text-[10px] opacity-60">
                    {m.higherBetter ? "↑" : "↓"}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {MODELS.map((model) => (
            <tr key={model.id}>
              <td className="font-medium text-gray-800 text-sm px-2 py-2 whitespace-nowrap">
                {model.name}
              </td>
              {METRICS.map((metric) => {
                const score = heatScore(model, metric);
                return (
                  <td
                    key={metric.key}
                    className="text-right tabular-nums px-2 py-2 rounded font-semibold transition-transform hover:scale-105"
                    style={{
                      backgroundColor: heatColor(score, 0.25),
                      color: heatColor(score, 1),
                      borderLeft: `3px solid ${heatColor(score, 1)}`,
                    }}
                  >
                    {formatValue(model[metric.key], metric)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span>Worse</span>
        <div
          className="h-2 flex-1 max-w-xs rounded-full"
          style={{
            background:
              "linear-gradient(to right, hsl(0,78%,50%), hsl(65,78%,50%), hsl(130,78%,50%))",
          }}
        />
        <span>Better</span>
      </div>
    </div>
  );
}

function PointCloud({ activeMetric }) {
  const W = 720;
  const H = 460;
  const PADDING = { top: 30, right: 30, bottom: 60, left: 70 };
  const plotW = W - PADDING.left - PADDING.right;
  const plotH = H - PADDING.top - PADDING.bottom;

  // X-axis: PSNR (quality, higher right). Y-axis: peak GPU GB (cost, lower top).
  const xVals = MODELS.map((m) => m.psnr);
  const yVals = MODELS.map((m) => m.peakGpuGb);
  const xMin = Math.min(...xVals) - 0.5;
  const xMax = Math.max(...xVals) + 0.5;
  const yMin = 0;
  const yMax = Math.max(...yVals) + 2;
  const xScale = (v) => PADDING.left + ((v - xMin) / (xMax - xMin)) * plotW;
  const yScale = (v) => PADDING.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  const clouds = useMemo(() => {
    const POINTS_PER_MODEL = 110;
    const out = [];
    MODELS.forEach((model, idx) => {
      const rng = mulberry32(0xc0ffee + idx * 1009);
      const cx = xScale(model.psnr);
      const cy = yScale(model.peakGpuGb);
      const score = heatScore(model, activeMetric);
      for (let i = 0; i < POINTS_PER_MODEL; i++) {
        const [zx, zy] = gaussianPair(rng);
        const radiusJitter = 0.45 + rng() * 0.55;
        const px = cx + zx * 18 * radiusJitter;
        const py = cy + zy * 14 * radiusJitter;
        const r = 1.2 + rng() * 1.6;
        const dist = Math.sqrt(zx * zx + zy * zy);
        const alpha = Math.max(0.15, 0.85 - dist * 0.25);
        const localScore = Math.max(0, Math.min(1, score + (rng() - 0.5) * 0.18));
        out.push({
          modelId: model.id,
          x: px,
          y: py,
          r,
          color: heatColor(localScore, alpha),
        });
      }
    });
    return out;
  }, [activeMetric]);

  const xTicks = useMemo(() => {
    const ticks = [];
    const step = 0.5;
    for (let v = Math.ceil(xMin / step) * step; v <= xMax; v += step) {
      ticks.push(Number(v.toFixed(2)));
    }
    return ticks;
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const ticks = [];
    const step = 4;
    for (let v = 0; v <= yMax; v += step) ticks.push(v);
    return ticks;
  }, [yMax]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-baseline justify-between mb-1 gap-3 flex-wrap">
        <h3 className="font-semibold text-gray-900">Model Point Cloud</h3>
        <span className="text-xs text-gray-500">
          Each cluster is one trainer · color heat reflects rank on{" "}
          <span className="font-semibold text-gray-700">{activeMetric.label}</span>
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        Position is fixed — quality (PSNR) on x, training cost (peak GPU memory) on y. The cloud around
        each centroid is purely visual, evoking the 3D Gaussian point clouds the models output.
        <span className="block mt-1 text-blue-700">
          Upper-right = expensive but accurate · <span className="text-emerald-700">lower-right = the sweet spot (cheap + accurate)</span>.
        </span>
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Model performance point cloud">
        <defs>
          <linearGradient id="bg-grid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#eef2f7" />
          </linearGradient>
        </defs>

        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={plotW}
          height={plotH}
          fill="url(#bg-grid)"
          stroke="#e5e7eb"
        />

        {/* sweet-spot highlight: high PSNR + low GPU */}
        <rect
          x={xScale((xMin + xMax) / 2)}
          y={yScale(yMax / 2)}
          width={xScale(xMax) - xScale((xMin + xMax) / 2)}
          height={yScale(0) - yScale(yMax / 2)}
          fill="hsla(130,78%,55%,0.06)"
        />

        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line
              x1={PADDING.left}
              x2={PADDING.left + plotW}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="#e5e7eb"
              strokeDasharray="2 3"
            />
            <text
              x={PADDING.left - 8}
              y={yScale(t) + 4}
              textAnchor="end"
              className="fill-gray-500"
              fontSize="11"
            >
              {t} GB
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line
              x1={xScale(t)}
              x2={xScale(t)}
              y1={PADDING.top}
              y2={PADDING.top + plotH}
              stroke="#e5e7eb"
              strokeDasharray="2 3"
            />
            <text
              x={xScale(t)}
              y={PADDING.top + plotH + 16}
              textAnchor="middle"
              className="fill-gray-500"
              fontSize="11"
            >
              {t.toFixed(1)}
            </text>
          </g>
        ))}

        {/* axis labels */}
        <text
          x={PADDING.left + plotW / 2}
          y={H - 18}
          textAnchor="middle"
          className="fill-gray-700"
          fontSize="12"
          fontWeight="600"
        >
          PSNR (dB) →  higher is better
        </text>
        <text
          x={18}
          y={PADDING.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 18 ${PADDING.top + plotH / 2})`}
          className="fill-gray-700"
          fontSize="12"
          fontWeight="600"
        >
          ↑ Peak GPU memory (GB) — lower is better
        </text>

        {/* the point cloud itself */}
        {clouds.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} />
        ))}

        {/* centroids + labels */}
        {MODELS.map((m) => {
          const cx = xScale(m.psnr);
          const cy = yScale(m.peakGpuGb);
          return (
            <g key={m.id}>
              <circle cx={cx} cy={cy} r={6} fill="white" stroke="#111827" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r={2.5} fill="#111827" />
              <text
                x={cx + 10}
                y={cy - 8}
                fontSize="12"
                fontWeight="700"
                className="fill-gray-900"
              >
                {m.name}
              </text>
              <text x={cx + 10} y={cy + 6} fontSize="10" className="fill-gray-500">
                PSNR {m.psnr.toFixed(2)} · {m.peakGpuGb.toFixed(2)} GB
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CompositeRanking() {
  const ranked = [...MODELS]
    .map((m) => ({ ...m, score: compositeScore(m) }))
    .sort((a, b) => b.score - a.score);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-1">Composite Ranking</h3>
      <p className="text-xs text-gray-500 mb-4">
        Average of normalized ranks across PSNR, SSIM, LPIPS, training time, peak GPU, and file size.
        Higher = better overall.
      </p>
      <div className="space-y-3">
        {ranked.map((m, i) => (
          <div key={m.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-800">
                <span className="text-gray-400 mr-2">#{i + 1}</span>
                {m.name}
              </span>
              <span className="text-xs tabular-nums font-semibold" style={{ color: heatColor(m.score) }}>
                {(m.score * 100).toFixed(0)} / 100
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${m.score * 100}%`,
                  background: `linear-gradient(to right, ${heatColor(Math.max(0, m.score - 0.2))}, ${heatColor(m.score)})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModelPointCloud() {
  const [activeMetricKey, setActiveMetricKey] = useState("psnr");
  const activeMetric = METRICS.find((m) => m.key === activeMetricKey) || METRICS[0];

  return (
    <section id="model-cloud" className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <h2 className="text-3xl font-bold text-gray-900">SotA Model Comparison</h2>
          <span className="text-xs text-gray-500">
            gerrard-hall · 10,000 iterations · Colab A100
          </span>
        </div>
        <p className="text-gray-600 mb-8 text-sm max-w-3xl leading-relaxed">
          Three open-source 3D Gaussian Splatting trainers — Splatfacto, Inria 3DGS, and Mip-Splatting —
          trained on the same scene with identical COLMAP poses and the same train/test split. The heatmap
          shows per-metric rank; the point cloud below positions each trainer in quality-vs-cost space and
          colors its cluster by whichever metric you select.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2">
            <HeatmapMatrix
              activeMetricKey={activeMetricKey}
              onPickMetric={setActiveMetricKey}
            />
          </div>
          <CompositeRanking />
        </div>

        <PointCloud activeMetric={activeMetric} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="font-semibold text-emerald-800 mb-1">Sweet spot · Splatfacto</p>
            <p className="text-emerald-900/80 leading-relaxed">
              Highest PSNR (20.25 dB) and the lowest GPU footprint (2.21 GB). Bottom-right of the cloud — accurate
              and cheap. Fits on a 4 GB consumer card.
            </p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4">
            <p className="font-semibold text-purple-800 mb-1">Reference cost · Inria 3DGS</p>
            <p className="text-purple-900/80 leading-relaxed">
              The canonical implementation. ~2.5× longer to train than the others (24.3 min) and lower PSNR
              despite using more Gaussians than Splatfacto.
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <p className="font-semibold text-rose-800 mb-1">VRAM ceiling · Mip-Splatting</p>
            <p className="text-rose-900/80 leading-relaxed">
              Trains fast (9.8 min) but peaks at 16.75 GB — ~7.6× Splatfacto's footprint. Its anti-aliasing benefit
              shows up under view-zoom changes, not in raw PSNR at 10k iters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
