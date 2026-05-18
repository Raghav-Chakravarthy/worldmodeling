import { scenes } from "../data/scenes";

const METRICS = [
  {
    key: "psnr",
    label: "PSNR",
    unit: " dB",
    direction: "higher",
    description: "Peak signal-to-noise ratio against held-out views. Higher = closer pixel-level match to ground truth.",
    decimals: 2,
  },
  {
    key: "ssim",
    label: "SSIM",
    unit: "",
    direction: "higher",
    description: "Structural similarity. Captures luminance, contrast, and structure agreement (0–1).",
    decimals: 3,
  },
  {
    key: "lpips",
    label: "LPIPS",
    unit: "",
    direction: "lower",
    description: "Learned perceptual distance using AlexNet features. Lower = more perceptually similar.",
    decimals: 3,
  },
  {
    key: "trainTimeMin",
    label: "Training time",
    unit: " min",
    direction: "lower",
    description: "Wall-clock to reach 10,000 iterations on a single Colab A100.",
    decimals: 2,
  },
  {
    key: "peakGpuGb",
    label: "Peak GPU memory",
    unit: " GB",
    direction: "lower",
    description: "Maximum VRAM observed during training. Determines what GPU tier can run the method.",
    decimals: 2,
  },
  {
    key: "numGaussians",
    label: "Gaussians",
    unit: "",
    direction: "info",
    description: "Number of 3D Gaussian primitives in the final model. Drives both quality and file size.",
    decimals: 0,
  },
  {
    key: "fileSizeMb",
    label: "PLY file size",
    unit: " MB",
    direction: "info",
    description: "On-disk model size — exactly what the browser must download to render the scene.",
    decimals: 1,
  },
];

const MODEL_COLORS = {
  splatfacto: { bar: "bg-blue-500", barWin: "bg-blue-600", text: "text-blue-700", chip: "bg-blue-50 text-blue-700 border-blue-200" },
  inria_3dgs: { bar: "bg-purple-500", barWin: "bg-purple-600", text: "text-purple-700", chip: "bg-purple-50 text-purple-700 border-purple-200" },
  mip_splatting: { bar: "bg-emerald-500", barWin: "bg-emerald-600", text: "text-emerald-700", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function pickWinnerId(metric) {
  if (metric.direction === "info") return null;
  const values = scenes
    .map((s) => ({ id: s.id, v: s[metric.key] }))
    .filter((x) => typeof x.v === "number");
  if (values.length === 0) return null;
  values.sort((a, b) => (metric.direction === "higher" ? b.v - a.v : a.v - b.v));
  return values[0].id;
}

function formatValue(v, metric) {
  if (typeof v !== "number") return "N/A";
  if (metric.key === "numGaussians") return v.toLocaleString();
  return v.toFixed(metric.decimals) + metric.unit;
}

function MetricPanel({ metric }) {
  const winnerId = pickWinnerId(metric);
  const numericValues = scenes.map((s) => s[metric.key]).filter((v) => typeof v === "number");
  const maxValue = numericValues.length ? Math.max(...numericValues) : 1;

  const directionLabel =
    metric.direction === "higher" ? "↑ higher is better"
    : metric.direction === "lower" ? "↓ lower is better"
    : "informational";
  const directionColor =
    metric.direction === "higher" ? "text-emerald-600"
    : metric.direction === "lower" ? "text-emerald-600"
    : "text-gray-500";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="font-semibold text-gray-900">{metric.label}</h3>
        <span className={`text-xs font-medium ${directionColor}`}>{directionLabel}</span>
      </div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">{metric.description}</p>
      <div className="space-y-2.5">
        {scenes.map((scene) => {
          const value = scene[metric.key];
          const isWinner = scene.id === winnerId;
          const hasValue = typeof value === "number";
          const widthPct = hasValue && maxValue > 0 ? Math.max((value / maxValue) * 100, 2) : 0;
          const color = MODEL_COLORS[scene.id] || MODEL_COLORS.splatfacto;
          return (
            <div key={scene.id} className="text-sm">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-medium ${isWinner ? color.text : "text-gray-700"}`}>
                  {scene.title}
                  {isWinner && <span className="ml-2 text-xs font-semibold uppercase tracking-wide">Best</span>}
                </span>
                <span className={`tabular-nums text-xs ${isWinner ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
                  {formatValue(value, metric)}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isWinner ? color.barWin : color.bar} ${isWinner ? "" : "opacity-60"}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeadlineStat({ label, value, sublabel, accent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-8">
      {scenes.map((s) => {
        const c = MODEL_COLORS[s.id] || MODEL_COLORS.splatfacto;
        return (
          <span key={s.id} className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${c.chip}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${c.barWin}`} />
            {s.title}
          </span>
        );
      })}
    </div>
  );
}

function Takeaways() {
  const splat = scenes.find((s) => s.id === "splatfacto");
  const inria = scenes.find((s) => s.id === "inria_3dgs");
  const mip = scenes.find((s) => s.id === "mip_splatting");
  const items = [
    {
      title: "Splatfacto wins quality and efficiency",
      body: `Highest PSNR (${splat.psnr.toFixed(2)} dB) and SSIM (${splat.ssim.toFixed(3)}), lowest LPIPS (${splat.lpips.toFixed(3)}) — while training in ${splat.trainTimeMin} min on only ${splat.peakGpuGb} GB VRAM. The smallest .ply (${splat.fileSizeMb} MB) is also the fastest to load in the browser.`,
    },
    {
      title: "Inria 3DGS is the slowest reference",
      body: `${inria.trainTimeMin} min training at 10k iters — ~2.5× longer than Splatfacto or Mip-Splatting at similar quality. Its larger Gaussian count (${inria.numGaussians.toLocaleString()}) does not translate into a PSNR win.`,
    },
    {
      title: "Mip-Splatting trades VRAM for anti-aliasing",
      body: `Trains as fast as Splatfacto (${mip.trainTimeMin} min) but peaks at ${mip.peakGpuGb} GB VRAM — ~7.6× Splatfacto. Quality at 10k iters is comparable to Inria; its anti-aliasing benefit shows up under view-zoom changes, not in raw PSNR.`,
    },
    {
      title: "More Gaussians ≠ better images",
      body: `Mip-Splatting has 2.2× the Gaussians of Splatfacto (${mip.numGaussians.toLocaleString()} vs ${splat.numGaussians.toLocaleString()}) but lower PSNR. Density is a representational cost, not a quality guarantee.`,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {items.map((it) => (
        <div key={it.title} className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">{it.title}</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

function SummaryTable() {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Model</th>
            <th className="px-4 py-3 text-right font-medium">PSNR ↑</th>
            <th className="px-4 py-3 text-right font-medium">SSIM ↑</th>
            <th className="px-4 py-3 text-right font-medium">LPIPS ↓</th>
            <th className="px-4 py-3 text-right font-medium">Train (min) ↓</th>
            <th className="px-4 py-3 text-right font-medium">Peak GPU ↓</th>
            <th className="px-4 py-3 text-right font-medium">Gaussians</th>
            <th className="px-4 py-3 text-right font-medium">.ply (MB)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {scenes.map((s) => (
            <tr key={s.id} className="text-gray-800">
              <td className="px-4 py-3 font-medium">{s.title}</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.psnr.toFixed(2)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.ssim.toFixed(3)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.lpips.toFixed(3)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.trainTimeMin?.toFixed(2)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.peakGpuGb?.toFixed(2)} GB</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.numGaussians.toLocaleString()}</td>
              <td className="px-4 py-3 text-right tabular-nums">{s.fileSizeMb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultsComparison() {
  const splat = scenes.find((s) => s.id === "splatfacto");
  return (
    <section id="results" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
          <h2 className="text-3xl font-bold text-gray-900">Results Comparison</h2>
          <span className="text-xs text-gray-500">
            gerrard-hall · 10,000 iterations · single Colab A100 (40 GB)
          </span>
        </div>
        <p className="text-gray-600 mb-8 text-sm max-w-3xl">
          Identical inputs (same COLMAP poses, same sparse point cloud, same train/test split). The only thing
          that changes between rows is the 3DGS trainer. Quality, compute cost, and model size are all measured
          on the same hardware.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <HeadlineStat
            label="Best PSNR"
            value={`${splat.psnr.toFixed(2)} dB`}
            sublabel={`${splat.title.split(" ")[0]} — +${(splat.psnr - 19.38).toFixed(2)} dB over Inria baseline`}
            accent="text-blue-700"
          />
          <HeadlineStat
            label="Fastest training"
            value={`${splat.trainTimeMin} min`}
            sublabel={`${splat.title.split(" ")[0]} on Colab A100 @ 10k iters`}
            accent="text-blue-700"
          />
          <HeadlineStat
            label="Lowest VRAM"
            value={`${splat.peakGpuGb} GB`}
            sublabel={`Fits on a 4 GB consumer GPU; Mip-Splatting needs 16+ GB`}
            accent="text-blue-700"
          />
          <HeadlineStat
            label="Smallest model"
            value={`${splat.fileSizeMb} MB`}
            sublabel={`~2× faster browser load than Inria, ~2.3× than Mip-Splatting`}
            accent="text-blue-700"
          />
        </div>

        <Legend />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {METRICS.map((m) => <MetricPanel key={m.key} metric={m} />)}
        </div>

        <SummaryTable />
        <Takeaways />
      </div>
    </section>
  );
}
