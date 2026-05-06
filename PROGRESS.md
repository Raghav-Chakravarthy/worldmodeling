# PhotoWalk — Progress Log

**Deadline: 2026-05-18**

---

## Research framing (updated)

The project is an **empirical study** — not a new algorithm. The novel contributions are:
1. Systematic capture condition study (image count, texture, lighting, path) — gap in existing literature
2. Failure case taxonomy with detection + mitigation for each mode
3. **DUSt3R vs full pipeline comparison** (Experiment 5) — neither the DUSt3R nor the 3DGS paper makes this comparison
4. Browser-accessible end-to-end path (Colab + HuggingFace + gsplat WebGL viewer)

---

## Status overview

| Stage | Status | Notes |
|---|---|---|
| Repo + project structure | DONE | `worldmodeling/` is the project root |
| Python scripts | DONE | All 4 scripts written and tested |
| Test dataset | DONE | gerrard-hall (100 images + COLMAP) downloaded |
| Gerrard-hall training | DONE | Teammate ran Colab, 73.5 MB splat.ply exported |
| splat.ply hosted on HuggingFace | DONE | `vcraghav/photowalk-splats` repo, desk scene URL set |
| Web landing page | DONE | React + Vite + Tailwind + gsplat viewer, builds clean |
| Browser viewer (gsplat) | DONE | SplatViewer.jsx + SceneViewerModal.jsx working |
| Nerfstudio install (local) | NOT DONE | Must be done on Colab (no local GPU) |
| Real scene capture | NOT DONE | Need phone photos — see capture guide below |
| Experiments 1–4 (capture conditions) | NOT DONE | Need reconstructed scenes first |
| Experiment 5 (DUSt3R comparison) | NOT DONE | Install DUSt3R on Colab, run at 5/10/20 images |
| Failure taxonomy (Section 6) | IN PROGRESS | Modes defined in outline; need image examples |
| Report | IN PROGRESS | Outline + related work drafted (new framing applied) |
| Video script | IN PROGRESS | Needs DUSt3R segment added |
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
- `report/outline.md` — full NeurIPS structure with section budgets; **updated with new research framing** (4 research questions, DUSt3R as Experiment 5, failure taxonomy table)
- `report/related_work.md` — draft prose for COLMAP, NeRF, 3DGS, DUSt3R, MASt3R + citations; **updated**
- `report/experiments.md` — auto-generated, will be updated as scenes are reconstructed

**Presentation:**
- `presentation/video_script.md` — timed 5-min script with slide cues; **needs DUSt3R segment (TODO)**

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

### 1. Run Experiment 5: DUSt3R vs Full Pipeline (highest priority — novel contribution)

On Colab, install and run DUSt3R on gerrard-hall image subsets (5, 10, 20 images).
Compare output quality against Splatfacto at same counts. Record qualitative scores.
```bash
pip install dust3r
# Then run DUSt3R inference on subsets — see report/outline.md §3.5
```

### 2. Capture real scenes (do this next)
Capture three scenes with your phone:

| Scene | What | Why |
|---|---|---|
| `desk_scene` | Cluttered desk, shelf, or bookcase | Easy — high texture, clear features |
| `hallway_scene` | Hallway, kitchen, or bedroom corner | Medium — larger space |
| `failure_scene` | Blank wall or dark room | Hard — expected to fail, needed for experiments |

**Capture protocol:** slow arc around the scene, 50–70 photos, 60–80% overlap, bright consistent light.
Put images in `scenes/<scene_name>/raw/`.

### 3. Validate locally
```bash
python scripts/validate_images.py --input scenes/desk_scene/raw
```

### 4. Preprocess locally
```bash
python scripts/preprocess_images.py --input scenes/desk_scene/raw --output scenes/desk_scene/processed --max-size 1920
```

### 5. Train on Colab
- Upload `scenes/desk_scene/processed/` to Google Drive
- Open Colab notebook (to be created), mount Drive, run pipeline
- Download exported `.ply`

### 6. Host on HuggingFace + update scenes.js
- Upload `.ply` to HuggingFace dataset repo (`vcraghav/photowalk-splats`)
- Copy direct download URL (CORS-enabled)
- Paste into `web/src/data/scenes.js` → `splat_url` field

### 7. Run experiments 1–4
After at least the desk scene works, capture and reconstruct the other scenes.
Record results in `experiments.json` (template already at project root).

### 8. Write report
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
