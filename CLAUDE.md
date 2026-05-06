# PhotoWalk — Claude Instructions

This file is loaded automatically by Claude Code. Read it before doing anything.

---

## What this project is

**PhotoWalk** is a Computer Vision final project that converts phone images into browser-viewable
walkable 3D scenes using Structure-from-Motion + 3D Gaussian Splatting.

- **Course:** Computer Vision (final project)
- **Deadline:** 2026-05-18
- **Deliverables:** 6-page NeurIPS-format report + 5-minute video demo

The main contribution is NOT inventing a new algorithm. It is:
1. **Empirical capture condition study** — systematic evaluation of how image count, texture, lighting, and capture path affect 3DGS quality (gap in existing literature: all benchmarks use controlled captures)
2. **Failure case taxonomy** — documented, reproducible failure modes with detection and mitigation (not present in existing 3DGS papers)
3. **DUSt3R vs full pipeline comparison** — novel head-to-head: at what image count does DUSt3R (pose-free, 2+ images) become competitive with COLMAP+Splatfacto (50+ images)?
4. **Browser accessibility** — cloud training (Colab) + HuggingFace hosting + WebGL viewer creates a GPU-free path for end users

---

## Tech stack

| Layer | Tool |
|---|---|
| Image validation + preprocessing | Python + OpenCV (`scripts/`) |
| Camera pose estimation | COLMAP (via Nerfstudio `ns-process-data`) |
| 3D reconstruction | Nerfstudio Splatfacto (3D Gaussian Splatting) |
| Browser viewer | gsplat (WebGL, embedded in React landing page) |
| Few-shot alternative | DUSt3R / MASt3R (pose-free reconstruction, no COLMAP) |
| Landing page | React + Vite + Tailwind (`web/`) |
| Report | NeurIPS format, outline in `report/outline.md` |

---

## Repository layout

```
scripts/
  validate_images.py       # blur, brightness, resolution checks → JSON + HTML report
  preprocess_images.py     # rename to frame_XXXX.jpg, optional resize
  run_pipeline.py          # orchestrates all steps, --dry-run or --execute
  summarize_experiment.py  # aggregates scene metrics → Markdown/CSV table

scenes/
  <scene_name>/
    raw/                   # phone images go here (gitignored)
    processed/             # after preprocess_images.py (gitignored)
    nerfstudio_data/       # after ns-process-data (gitignored)
    nerfstudio_outputs/    # after ns-train (gitignored)
    exports/splat/         # .ply file for SuperSplat (gitignored)
    metrics/               # validation.json + HTML (committed)

web/                       # React landing page
report/                    # report outline, related work, experiment results
presentation/              # 5-min video script
```

---

## How to run the pipeline

### Step 1 — validate images
```bash
python scripts/validate_images.py --input scenes/<scene>/raw
```
Outputs `scenes/<scene>/metrics/validation.json` and `validation_summary.html`.

### Step 2 — preprocess
```bash
python scripts/preprocess_images.py --input scenes/<scene>/raw --output scenes/<scene>/processed --max-size 1920
```

### Step 3 — full pipeline (dry run first, always)
```bash
python scripts/run_pipeline.py --scene <scene> --input scenes/<scene>/raw --dry-run
python scripts/run_pipeline.py --scene <scene> --input scenes/<scene>/raw --execute
```
Use `--skip-to train` or `--skip-to export` to resume after partial completion.

### Step 4 — summarize experiments
```bash
python scripts/summarize_experiment.py --scenes-dir scenes --output report/experiments.md
# Or with a filled-in manifest:
python scripts/summarize_experiment.py --manifest experiments.json --output report/experiments.md
```

### Step 5 — web landing page
```bash
cd web && npm install && npm run dev   # http://localhost:5173
```
After training: update `web/src/data/scenes.js` with real SuperSplat viewer URLs.

---

## Hardware situation

- **Local machine:** Intel Iris Xe only — **no Nvidia GPU, CUDA unavailable**
- **Training must be done on Google Colab** (free T4 GPU) or a rented GPU
- All Python scripts (validate, preprocess, dry-run pipeline, summarize) run fine locally
- Nerfstudio is NOT installed locally — install on Colab

---

## Colab workflow (for training)

1. Run validation + preprocessing locally
2. Upload `scenes/<scene>/processed/` to Google Drive
3. On Colab: mount Drive, install Nerfstudio, run `ns-process-data` + `ns-train splatfacto`
4. Download the exported `.ply` back locally
5. Upload `.ply` to SuperSplat, publish, paste URL into `web/src/data/scenes.js`

---

## Experiments to run (core deliverable)

### Experiments 1–4: Capture condition study (full COLMAP+Splatfacto pipeline)

| Experiment | Variable | Levels |
|---|---|---|
| 1 | Image count | 10 / 20 / 50 / 100 images of same scene |
| 2 | Texture | High (cluttered desk) vs Very Low (blank wall) |
| 3 | Lighting | Bright vs Dim (same scene) |
| 4 | Capture path | Smooth arc vs Random disconnected shots |

Record for each: `registered_cameras`, `reconstruction_success`, `qualitative_score` (1–5), `file_size_mb`.

### Experiment 5: DUSt3R vs Full Pipeline (KEY — novel contribution)

- Run DUSt3R on same scenes using **5 / 10 / 20 image subsets** (no COLMAP needed)
- Compare output quality vs. Splatfacto at same image counts
- Research question: **below what image count does DUSt3R become competitive?**
- Expected: DUSt3R wins below ~15 images; Splatfacto wins above ~30
- Install: `pip install dust3r` (runs on Colab T4)

### Failure taxonomy (Section 6 of report)

Document each failure mode with an image example:
- COLMAP cannot initialize (low texture, no SIFT keypoints)
- Partial reconstruction (insufficient overlap)
- Floaters (reflections/transparency)
- Ghosting (moving objects)
- Color artifacts (mixed lighting)

---

## Report structure (NeurIPS, ≤ 6 pages)

Full outline: `report/outline.md`
Related work draft: `report/related_work.md`
Experiment results: `report/experiments.md`

Key citations to include:
- COLMAP — Schönberger & Frahm, CVPR 2016
- NeRF — Mildenhall et al., ECCV 2020
- 3D Gaussian Splatting — Kerbl et al., SIGGRAPH 2023
- Nerfstudio — Tancik et al., SIGGRAPH 2023
- DUSt3R — Wang et al., CVPR 2024
- MASt3R — Leroy et al., 2024

---

## Test dataset (already downloaded)

`scenes/gerrard-hall/gerrard-hall/` contains:
- 100 real building exterior photos (JPEG, ~3024×2016)
- Pre-computed COLMAP sparse reconstruction (`sparse/cameras.txt`, `images.txt`, `points3D.txt`)
- COLMAP database (`database.db`)

This is the **COLMAP gerrard-hall example dataset** from the official COLMAP GitHub releases.
Use it to test scripts and Colab training without needing your own photos first.
To use: copy images from `scenes/gerrard-hall/gerrard-hall/images/` into `scenes/gerrard-hall/raw/`.

---

## Style rules

- Python scripts: argparse, logging, dry-run mode for external commands, JSON/Markdown outputs
- No comments explaining what code does — only WHY when non-obvious
- Web: React + Vite + Tailwind, no extra UI libraries
- Keep scope tight — no features beyond what the rubric requires

---

## What NOT to do

- Do not add GPU-dependent code to the local Python scripts (they must run on CPU)
- Do not commit `scenes/*/raw/`, `scenes/*/processed/`, or any `nerfstudio_outputs/`
- Do not invent new CV algorithms — the contribution is the system + experiments
- Do not over-engineer the web landing page — it links to SuperSplat, that's enough
