import { useEffect, useRef, useState } from "react";
import * as SPLAT from "gsplat";

function inferFormat(url) {
  const lower = url.toLowerCase().split("?")[0];
  if (lower.endsWith(".ply")) return "ply";
  return "splat";
}

export default function SplatViewer({ url, className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!url) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;
    let rafId = 0;
    let renderer = null;
    let controls = null;

    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    renderer = new SPLAT.WebGLRenderer(canvas);
    controls = new SPLAT.OrbitControls(camera, canvas);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth > 0 && clientHeight > 0) {
        renderer.setSize(clientWidth, clientHeight);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const format = inferFormat(url);
    const loadPromise =
      format === "ply"
        ? SPLAT.PLYLoader.LoadAsync(url, scene, (p) => setProgress(p))
        : SPLAT.Loader.LoadAsync(url, scene, (p) => setProgress(p));

    loadPromise
      .then(() => {
        if (disposed) return;
        setStatus("ready");
        const frame = () => {
          if (disposed) return;
          controls.update();
          renderer.render(scene, camera);
          rafId = requestAnimationFrame(frame);
        };
        rafId = requestAnimationFrame(frame);
      })
      .catch((err) => {
        if (disposed) return;
        setStatus("error");
        setErrorMsg(err?.message || "Failed to load splat");
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      try {
        renderer?.dispose?.();
      } catch {}
    };
  }, [url]);

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-black ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm">
          <div className="text-center">
            <div className="mb-2">Loading 3D scene…</div>
            <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-blue-400 transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-white/60">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-300 text-sm p-4 text-center">
          Failed to load splat: {errorMsg}
        </div>
      )}
      {status === "ready" && (
        <div className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/40 px-2 py-1 rounded">
          Drag to rotate · scroll to zoom · right-click drag to pan
        </div>
      )}
    </div>
  );
}
