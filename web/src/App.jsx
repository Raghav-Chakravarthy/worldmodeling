import { scenes, experiments } from "./data/scenes";

// ── Icons (inline SVG to avoid a dependency) ────────────────────────────────
const IconCamera = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconCube = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconExternal = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

// ── Sub-components ───────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-gray-900 flex items-center gap-2">
          <IconCube /> PhotoWalk
        </span>
        <div className="flex gap-6 text-sm text-gray-600">
          <a href="#pipeline" className="hover:text-blue-600 transition-colors">Pipeline</a>
          <a href="#scenes" className="hover:text-blue-600 transition-colors">Scenes</a>
          <a href="#experiments" className="hover:text-blue-600 transition-colors">Experiments</a>
          <a href="#capture" className="hover:text-blue-600 transition-colors">Capture Guide</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-900 to-blue-900 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block mb-4 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-200">
          Computer Vision Final Project
        </span>
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          PhotoWalk
        </h1>
        <p className="text-xl text-slate-300 mb-2">
          Browser-Based Walkable 3D Scene Reconstruction from Phone Images
        </p>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto text-sm leading-relaxed">
          We combine classical Structure-from-Motion with 3D Gaussian Splatting to turn casual phone photos
          into interactive, walkable 3D scenes rendered entirely in the browser.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#scenes"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-lg font-medium transition-colors">
            Explore Scenes
          </a>
          <a href="#experiments"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-colors">
            View Experiments
          </a>
        </div>
      </div>
    </section>
  );
}

function PipelineStep({ number, title, tools, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
        {number}
      </div>
      <div className="pb-8 border-l border-gray-200 pl-6 -ml-4">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-blue-600 font-mono mt-0.5 mb-1">{tools}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function Pipeline() {
  const steps = [
    { title: "Capture", tools: "Phone camera", description: "50–100 overlapping images, slow arc path around the scene with 60–80% overlap between frames." },
    { title: "Validate", tools: "validate_images.py", description: "Check blur, brightness, resolution, and image count before committing to a long reconstruction run." },
    { title: "Preprocess", tools: "preprocess_images.py", description: "Rename images consistently, resize to reduce GPU memory, skip corrupted files." },
    { title: "Structure from Motion", tools: "COLMAP via ns-process-data", description: "Estimate camera poses and build a sparse 3D point cloud from feature matches across images." },
    { title: "Gaussian Splatting", tools: "Nerfstudio Splatfacto", description: "Optimize 3D Gaussians initialized from the sparse point cloud for photorealistic, real-time rendering." },
    { title: "Export & Host", tools: "ns-export + SuperSplat", description: "Export a .ply file and open it in SuperSplat for browser-based interactive viewing and sharing." },
  ];
  return (
    <section id="pipeline" className="py-20 px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Pipeline</h2>
        <p className="text-gray-600 mb-10 text-sm">
          Six stages from phone images to an interactive browser scene.
        </p>
        <div>
          {steps.map((s, i) => (
            <PipelineStep key={i} number={i + 1} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScoreStars({ score }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= score ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}
    </span>
  );
}

function SceneCard({ scene }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-slate-100 h-44 flex items-center justify-center text-slate-400">
        {scene.thumbnail
          ? <img src={scene.thumbnail} alt={scene.title} className="w-full h-full object-cover" />
          : <span className="text-sm">[Scene thumbnail]</span>
        }
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{scene.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${scene.difficultyColor}`}>
            {scene.difficulty}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{scene.description}</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
          <span>Images: <strong className="text-gray-800">{scene.images}</strong></span>
          <span>Texture: <strong className="text-gray-800">{scene.texture}</strong></span>
          <span>Lighting: <strong className="text-gray-800">{scene.lighting}</strong></span>
          <span>Size: <strong className="text-gray-800">{scene.fileSizeMb > 0 ? `${scene.fileSizeMb} MB` : "N/A"}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <ScoreStars score={scene.score} />
          <span className="text-xs text-gray-500">quality score</span>
        </div>
        {scene.artifacts && (
          <p className="text-xs text-gray-400 italic">Artifacts: {scene.artifacts}</p>
        )}
        <div className="mt-auto pt-2">
          {scene.viewer_url && scene.viewer_url !== "#" ? (
            <a href={scene.viewer_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
              Open in SuperSplat <IconExternal />
            </a>
          ) : scene.viewer_url === "#" ? (
            <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
              Viewer link coming soon
            </span>
          ) : (
            <span className="inline-flex items-center px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm">
              Reconstruction failed — see failure analysis
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Scenes() {
  return (
    <section id="scenes" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reconstructed Scenes</h2>
        <p className="text-gray-600 mb-10 text-sm">
          Three scenes chosen to span the difficulty spectrum and expose reconstruction failure modes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenes.map(s => <SceneCard key={s.id} scene={s} />)}
        </div>
      </div>
    </section>
  );
}

function ExperimentRow({ exp }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-3">{exp.variable}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="text-red-500 font-medium w-12 shrink-0">Low:</span>
          <span className="text-gray-600">{exp.low}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-green-600 font-medium w-12 shrink-0">High:</span>
          <span className="text-gray-600">{exp.high}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-blue-600 font-medium w-12 shrink-0">Best:</span>
          <span className="text-gray-600">{exp.sweet_spot}</span>
        </div>
        <div className="pt-2 border-t border-gray-100 text-gray-700 leading-relaxed">
          <strong>Finding: </strong>{exp.finding}
        </div>
      </div>
    </div>
  );
}

function Experiments() {
  return (
    <section id="experiments" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Experiments</h2>
        <p className="text-gray-600 mb-10 text-sm">
          We systematically vary four factors and measure reconstruction quality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {experiments.map(e => <ExperimentRow key={e.variable} exp={e} />)}
        </div>
      </div>
    </section>
  );
}

function CaptureGuide() {
  const dos = [
    "Move slowly in a smooth arc or circular path around the scene",
    "Maintain 60–80% overlap between consecutive frames",
    "Capture 50–100 images for an indoor scene (~3–5 min of shooting)",
    "Shoot in consistent, bright lighting — overcast daylight or well-lit indoors",
    "Include objects at multiple depths to help stereo triangulation",
    "Vary your height slightly (kneel, stand straight, hold camera up)",
  ];
  const donts = [
    "Don't take random, disconnected shots from arbitrary positions",
    "Don't shoot reflective surfaces (mirrors, glass, glossy floors)",
    "Don't photograph blank walls or low-texture surfaces",
    "Don't move during exposure — causes motion blur",
    "Don't change lighting conditions mid-capture",
    "Don't include moving people or objects in the scene",
  ];
  return (
    <section id="capture" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Capture Guide</h2>
        <p className="text-gray-600 mb-10 text-sm">
          Image quality at capture time determines reconstruction quality more than any algorithm choice.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
              Do
            </h3>
            <ul className="space-y-2">
              {dos.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-500 shrink-0">✓</span> {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">✗</span>
              Don&apos;t
            </h3>
            <ul className="space-y-2">
              {donts.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-400 shrink-0">✗</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-6 bg-slate-900 text-slate-400 text-sm text-center">
      <p className="mb-1">
        PhotoWalk — Computer Vision Final Project
      </p>
      <p>
        Built with COLMAP · Nerfstudio Splatfacto · 3D Gaussian Splatting · React + Vite + Tailwind
      </p>
    </footer>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <NavBar />
      <Hero />
      <Pipeline />
      <Scenes />
      <Experiments />
      <CaptureGuide />
      <Footer />
    </div>
  );
}
