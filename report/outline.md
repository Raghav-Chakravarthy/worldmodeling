# PhotoWalk: Report Outline (NeurIPS Format, ≤ 6 pages)

---

## Abstract (~150 words)
- What: a practical pipeline for converting casual phone images into browser-viewable walkable 3D scenes
- How: image quality validation → COLMAP Structure-from-Motion → 3D Gaussian Splatting via Nerfstudio Splatfacto → SuperSplat browser viewer
- Contribution: working end-to-end system + systematic evaluation of capture factors
- Key finding: favorable conditions (50+ images, good lighting, textured scene, smooth path) produce convincing interactive scenes; low texture and poor overlap remain hard failure cases

---

## 1. Introduction (~0.5 page)
- Growing interest in casual 3D capture with consumer devices
- Existing tools are powerful but fragmented — no single beginner-friendly pipeline
- We build PhotoWalk: validate → reconstruct → browse
- State the three research questions:
  1. How many images does a casual capture need?
  2. What scene and lighting properties predict reconstruction success?
  3. Can the result be hosted and explored in a browser without specialized software?

---

## 2. Related Work (~1 page)

### 2.1 Structure from Motion
- Multi-view geometry: estimating camera poses from feature correspondences
- COLMAP [Schönberger & Frahm 2016]: general-purpose SfM/MVS pipeline; the standard baseline

### 2.2 Neural Radiance Fields
- NeRF [Mildenhall et al. 2020]: neural implicit scene representation, high quality but slow to render
- Relevant because 3DGS is often framed as a successor

### 2.3 3D Gaussian Splatting
- Kerbl et al. 2023: represent scene as optimized 3D Gaussians, render via visibility-aware splatting
- Real-time performance; starts from COLMAP sparse points; can be exported as .ply
- Nerfstudio Splatfacto: training implementation used in this project

### 2.4 Browser-Based 3D Visualization
- SuperSplat (PlayCanvas): browser editor and publisher for Gaussian splat .ply files
- Three.js gaussian-splatting libraries: alternative lightweight viewer
- WebGL/WebGPU as the rendering substrate

---

## 3. Method (~1.5 pages)

### 3.1 Image Capture Protocol
- Device: phone camera (specify model)
- Path: smooth arc or figure-8 around the scene
- Overlap: 60–80% between consecutive frames
- Target: 50–100 images per scene

### 3.2 Image Quality Validation (scripts/validate_images.py)
- Blur detection: Laplacian variance (threshold: 100)
- Brightness: mean grayscale (reject < 40 or > 220)
- Resolution check: minimum 1280×720
- Output: JSON report with per-image metrics and scene-level warnings

### 3.3 Preprocessing (scripts/preprocess_images.py)
- Consistent renaming: frame_0001.jpg, frame_0002.jpg …
- Optional downsampling (--max-size 1920) to reduce GPU memory

### 3.4 Camera Pose Estimation (COLMAP via ns-process-data)
- Exhaustive or sequential feature matching (SIFT)
- Bundle adjustment for sparse 3D point cloud
- Output: transforms.json with camera poses

### 3.5 Gaussian Splat Reconstruction (Nerfstudio Splatfacto)
- Initialize 3D Gaussians from COLMAP sparse points
- Optimize via differentiable rendering: position, covariance, opacity, spherical harmonics color
- Training: ~30k iterations on GPU

### 3.6 Export and Browser Hosting (SuperSplat)
- Export: ns-export gaussian-splat → .ply file
- SuperSplat: load .ply, optimize scene, publish or export self-hostable viewer
- Landing page: React + Vite + Tailwind with scene gallery and experiment table

---

## 4. Experiments (~1 page)

### 4.1 Scenes
| Scene | Condition | Images | Lighting | Texture |
|---|---|---|---|---|
| Desk | Easy | 20 / 50 / 100 | Bright | High |
| Hallway | Medium | 50 | Mixed | Medium |
| Blank wall | Failure | 30 | Bright | Very low |

### 4.2 Variables Tested
1. **Image count** — 20 vs 50 vs 100 images of the desk scene
2. **Texture** — textured desk vs blank wall
3. **Lighting** — bright room vs dimmed room (same scene)
4. **Capture path** — smooth arc vs random disconnected shots

### 4.3 Metrics
- COLMAP success / failure (binary)
- Number of registered cameras (from COLMAP log)
- Qualitative score 1–5 (visual inspection of splat)
- Splat file size (MB)
- Browser load time (seconds)

---

## 5. Results (~0.5 page)
- Summary table: [see report/experiments.md]
- Image count: 50 images sufficient for desk scene; 20 images leaves geometry gaps
- Texture: blank wall always fails; cluttered scene always succeeds
- Lighting: dim images reduce registered cameras by ~30%
- Capture path: smooth arc reconstructs reliably; random shots fragment geometry

---

## 6. Failure Cases (~0.25 page)
- Low-texture surfaces: no SIFT keypoints → COLMAP cannot initialize
- Reflective objects: inconsistent appearance across views → floaters
- Moving objects: violates static scene assumption → ghosting artifacts
- Insufficient overlap: disconnected graph in COLMAP → partial reconstruction

---

## 7. Limitations (~0.25 page)
- No quantitative 3D ground truth (no LiDAR reference)
- GPU required for Splatfacto training (~1–3 hours per scene on consumer GPU)
- HEIC images from iPhone require conversion (handled in preprocessing)
- SuperSplat hosting subject to file size limits

---

## 8. Conclusion (~0.25 page)
- PhotoWalk shows casual phone capture can produce interactive browser-viewable 3D scenes
- Image quality at capture time is the dominant factor — more so than algorithm choice
- Future work: mobile-friendly training, depth-sensor fusion, dynamic scene handling
