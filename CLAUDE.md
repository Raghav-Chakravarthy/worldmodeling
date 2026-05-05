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
1. A working end-to-end pipeline with image quality validation
2. A hosted browser-based 3D viewer
3. Systematic experiments showing when reconstruction succeeds and fails

---

## Tech stack

| Layer | Tool |
|---|---|
| Image validation + preprocessing | Python + OpenCV (`scripts/`) |
| Camera pose estimation | COLMAP (via Nerfstudio `ns-process-data`) |
| 3D reconstruction | Nerfstudio Splatfacto (3D Gaussian Splatting) |
| Browser viewer | SuperSplat (playcanvas.com/supersplat) |
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

Vary these four factors and record results in `experiments.json`:

| Variable | Levels |
|---|---|
| Image count | 20 / 50 / 100 images of same scene |
| Texture | High (cluttered desk) vs Very Low (blank wall) |
| Lighting | Bright vs Dim (same scene) |
| Capture path | Smooth arc vs Random disconnected shots |

Record for each: `reconstruction_success`, `major_artifacts`, `viewer_file_size_mb`, `qualitative_score` (1–5).

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
