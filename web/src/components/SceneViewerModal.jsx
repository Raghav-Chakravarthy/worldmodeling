import { useEffect } from "react";
import SplatViewer from "./SplatViewer";

export default function SceneViewerModal({ scene, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!scene?.splat_url) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex flex-col"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-5 py-3 bg-slate-900/95 text-white border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="font-semibold">{scene.title}</div>
          <div className="text-xs text-white/60">
            {scene.demo_label || "Live 3D Gaussian Splatting reconstruction"}
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm"
        >
          Close (Esc)
        </button>
      </div>
      <div className="flex-1 min-h-0" onClick={(e) => e.stopPropagation()}>
        <SplatViewer url={scene.splat_url} />
      </div>
    </div>
  );
}
