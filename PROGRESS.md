# PhotoWalk — Progress Log

**Deadline: 2026-05-18**

---

## Status overview

| Stage | Status | Notes |
|---|---|---|
| Repo + project structure | DONE | `worldmodeling/` is the project root |
| Python scripts | DONE | All 4 scripts written and tested |
| Test dataset | DONE | gerrard-hall (100 images + COLMAP) downloaded |
| Nerfstudio install | NOT DONE | Must be done on Colab (no local GPU) |
| Real scene capture | NOT DONE | Need phone photos — see capture guide below |
| COLMAP / ns-process-data | NOT DONE | Runs on Colab |
| Splatfacto training | NOT DONE | Runs on Colab |
| Splat export + SuperSplat | NOT DONE | After training |
| Web landing page | DONE | React + Vite + Tailwind, builds clean |
| Experiments | NOT DONE | Need reconstructed scenes first |
| Report | IN PROGRESS | Outline + related work drafted |
| Video script | DONE | 5-min timed script with slide cues |
| Final submission | NOT DONE | Due 2026-05-18 |

---

## Done in detail

### 2026-05-04/05 — Initial build

**Scripts written (`scripts/`):**
- `validate_images.py` — Laplacian blur score, brightness mean, resolution check, per-image JSON + HTML report
- `preprocess_images.py` — rename to `frame_XXXX.jpg`, optional `--max-size` resize, skip corrupted
- `run_pipeline.py` — orchestrates validate → preprocess → ns-process-data → ns-train → ns-export; `--dry-run` and `--execute` modes; `--skip-to` for resuming
- `summarize_experiment.py` — auto-discovers scenes or uses a JSON manifest; outputs Markdown/CSV table

**Tested against gerrard-hall dataset:**
- `validate_images.py` ran on 30 images — flagged 6 blurry, output JSON + HTML ✓
- `preprocess_images.py` renamed and resized 30 images to 1920px ✓
- `run_pipeline.py --dry-run` printed all 5 pipeline commands correctly ✓
- `summarize_experiment.py` auto-discovered scenes and generated experiment table ✓

**Web landing page (`web/`):**
- React + Vite + Tailwind; builds clean (`npm run build` passes)
- Sections: hero, pipeline (6 steps), scene gallery, experiments (4 variables), capture guide, footer
- Scene data in `web/src/data/scenes.js` — update `viewer_url` fields after SuperSplat publish
- Run locally: `cd web && npm run dev` → http://localhost:5173

**Report documents:**
- `report/outline.md` — full NeurIPS structure with section budgets
- `report/related_work.md` — draft prose for COLMAP, NeRF, 3DGS, SuperSplat + citations
- `report/experiments.md` — auto-generated, will be updated as scenes are reconstructed

**Presentation:**
- `presentation/video_script.md` — timed 5-min script with slide cues

**Test dataset downloaded:**
- `scenes/gerrard-hall/gerrard-hall/` — 100 building exterior JPEGs + pre-baked COLMAP sparse reconstruction
- Source: official COLMAP GitHub releases (gerrard-hall.zip, ~959 MB)
- Already has `sparse/cameras.txt`, `images.txt`, `points3D.txt` — skip COLMAP step on Colab

---

## Hardware note

Local machine has **Intel Iris Xe only — no Nvidia GPU**.
- Python scripts: run locally (CPU only, OpenCV)
- Nerfstudio training: **must use Google Colab** (free T4)
- CUDA is not available locally even though PyTorch+cu118 is installed

---

## Next steps (in order)

### 1. Capture real scenes (do this first)
Capture three scenes with your phone:

| Scene | What | Why |
|---|---|---|
| `desk_scene` | Cluttered desk, shelf, or bookcase | Easy — high texture, clear features |
| `hallway_scene` | Hallway, kitchen, or bedroom corner | Medium — larger space |
| `failure_scene` | Blank wall or dark room | Hard — expected to fail, needed for experiments |

**Capture protocol:** slow arc around the scene, 50–70 photos, 60–80% overlap, bright consistent light.
Put images in `scenes/<scene_name>/raw/`.

### 2. Validate locally
```bash
python scripts/validate_images.py --input scenes/desk_scene/raw
```

### 3. Preprocess locally
```bash
python scripts/preprocess_images.py --input scenes/desk_scene/raw --output scenes/desk_scene/processed --max-size 1920
```

### 4. Train on Colab
- Upload `scenes/desk_scene/processed/` to Google Drive
- Open Colab notebook (to be created), mount Drive, run pipeline
- Download exported `.ply`

### 5. Publish on SuperSplat
- Upload `.ply` to https://playcanvas.com/supersplat/editor
- Publish and copy viewer URL
- Paste URL into `web/src/data/scenes.js`

### 6. Run experiments
After at least the desk scene works, capture and reconstruct the other scenes.
Record results in `experiments.json` (template already at project root).

### 7. Write report
Use `report/outline.md` as the skeleton.
Fill in `report/experiments.md` from real results.
Add screenshots of the viewer and COLMAP point cloud as figures.

---

## Open questions / decisions pending

- [ ] Which specific room/objects to use for desk_scene and hallway_scene
- [ ] Whether to use SuperSplat hosting or self-host the viewer on GitHub Pages
- [ ] Whether the Colab training notebook needs to be built (ask Claude)
- [ ] Image count experiment: capture desk_scene at 20, 50, and 100 images separately or use subsets?
  - Recommendation: capture 100, then use subsets of 20 and 50 for the experiment (saves recapturing)

---

## Known issues

- `validate_images.py` encoding warning on Windows (non-ASCII arrow in log messages) — cosmetic only, does not affect output
- `experiments.json` is gitignored (fill-in file) — share manually between group members or commit a filled version under a different name
