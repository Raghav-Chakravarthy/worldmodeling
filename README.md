# PhotoWalk

**Browser-Based Walkable 3D Scene Reconstruction from Phone Images**

> Computer Vision Final Project

PhotoWalk converts a set of ordinary phone photos into an interactive, walkable 3D scene
viewable in any modern browser. The pipeline combines classical Structure-from-Motion (COLMAP)
with 3D Gaussian Splatting (Nerfstudio Splatfacto) and hosts the result via SuperSplat.

---

## Pipeline

```
Phone images
  → validate_images.py      (blur, brightness, resolution checks)
  → preprocess_images.py    (rename, resize, skip corrupted)
  → ns-process-data         (COLMAP: feature matching + pose estimation)
  → ns-train splatfacto     (3D Gaussian Splatting)
  → ns-export gaussian-splat (export .ply)
  → SuperSplat              (browser viewer + hosting)
```

---

## Setup

See [setup.md](setup.md) for full installation instructions.

Quick start:
```bash
conda create -n photowalk python=3.10 -y && conda activate photowalk
pip install -r requirements.txt
# Install Nerfstudio separately — see setup.md
cd web && npm install
```

---

## How to Collect Images

1. Pick a scene with lots of texture (books, furniture, objects at multiple depths).
2. Move slowly in a smooth arc around the scene.
3. Keep 60–80% overlap between consecutive frames.
4. Capture 50–100 images. 3–5 minutes of careful shooting.
5. Use bright, consistent lighting. Avoid mirrors, glass, and moving objects.

---

## How to Validate Images

```bash
python scripts/validate_images.py --input scenes/my_scene/raw
# Output: scenes/my_scene/metrics/validation.json + validation_summary.html
```

---

## How to Run Reconstruction

### Dry run (see commands without executing):
```bash
python scripts/run_pipeline.py --scene my_scene --input scenes/my_scene/raw --dry-run
```

### Full pipeline:
```bash
python scripts/run_pipeline.py --scene my_scene --input scenes/my_scene/raw --execute
```

### Resume from a specific step:
```bash
python scripts/run_pipeline.py --scene my_scene --input scenes/my_scene/raw --execute --skip-to train
```

---

## How to Export Splats

After training, find `config.yml` in `scenes/my_scene/nerfstudio_outputs/`.
Then:
```bash
ns-export gaussian-splat \
  --load-config scenes/my_scene/nerfstudio_outputs/<name>/splatfacto/<timestamp>/config.yml \
  --output-dir scenes/my_scene/exports/splat
```

`run_pipeline.py --execute` does this automatically if training completed.

---

## How to Open the Hosted Viewer

1. Upload the exported `.ply` to [SuperSplat](https://playcanvas.com/supersplat/editor).
2. Optimize and publish.
3. Copy the hosted viewer URL into `web/src/data/scenes.js` (`viewer_url` field).

---

## Web Landing Page

```bash
cd web
npm run dev     # http://localhost:5173
npm run build   # production build → web/dist/
```

Deploy `web/dist/` to GitHub Pages, Netlify, or Vercel.

---

## Experiments

| Variable | Levels | Key Finding |
|---|---|---|
| Image count | 20 / 50 / 100 | 50 sufficient; 20 leaves gaps; 100 has diminishing returns |
| Texture | High / Low | Low texture always fails (SfM cannot initialize) |
| Lighting | Bright / Dim | Dim reduces registered cameras by ~30% |
| Capture path | Arc / Random | Random disconnected shots fragment geometry |

Full results: [report/experiments.md](report/experiments.md)

---

## Summarize Experiments

```bash
# Initialize a manifest template to fill in manually:
python scripts/summarize_experiment.py --init-manifest

# Generate Markdown table from manifest:
python scripts/summarize_experiment.py --manifest experiments.json --output report/experiments.md

# Or auto-discover scenes:
python scripts/summarize_experiment.py --scenes-dir scenes --output report/experiments.md
```

---

## Known Limitations

- **Low-texture scenes always fail** — SfM requires distinctive visual features.
- **No GPU, no training** — Splatfacto requires a CUDA GPU. Use Google Colab as fallback.
- **HEIC images** — iPhone users: switch to JPEG in Settings → Camera → Formats, or install `pillow-heif`.
- **Moving objects** — 3DGS assumes a static scene. People walking through create ghosting artifacts.
- **Large splats** — 100-image scenes can produce 100 MB+ .ply files. SuperSplat can compress them.
- **No quantitative ground truth** — quality is evaluated qualitatively (1–5 score).

---

## Repository Structure

```
photowalk/
├── scripts/
│   ├── validate_images.py
│   ├── preprocess_images.py
│   ├── run_pipeline.py
│   └── summarize_experiment.py
├── scenes/
│   └── <scene_name>/
│       ├── raw/           ← your phone images go here
│       ├── processed/     ← renamed/resized images
│       ├── nerfstudio_data/
│       ├── nerfstudio_outputs/
│       ├── exports/splat/ ← .ply file for SuperSplat
│       └── metrics/       ← validation.json
├── web/                   ← React + Vite + Tailwind landing page
├── report/
│   ├── outline.md
│   ├── related_work.md
│   └── experiments.md
├── presentation/
│   └── video_script.md
├── requirements.txt
└── setup.md
```

---

## Tools Used

| Tool | Role |
|---|---|
| COLMAP | Structure-from-Motion, sparse 3D reconstruction |
| Nerfstudio Splatfacto | 3D Gaussian Splatting training |
| SuperSplat | Browser-based splat viewer and hosting |
| OpenCV | Image validation and preprocessing |
| React + Vite + Tailwind | Web landing page |
