# PhotoWalk: Report Outline (NeurIPS Format, ≤ 6 pages)

---

## Abstract (~150 words)
- What: an empirical study of 3D Gaussian Splatting reconstruction quality under casual phone capture conditions, with a browser-based interactive viewer
- How: capture condition study (image count, lighting, texture, path) + failure taxonomy + DUSt3R comparison + browser deployment
- Contribution:
  1. Systematic evaluation of how capture quality factors affect 3DGS reconstruction — filling a gap in existing literature that only evaluates controlled captures
  2. A documented failure case taxonomy explaining when and why reconstruction fails
  3. A comparison between full COLMAP+Splatfacto pipeline and few-shot DUSt3R at varying image counts
  4. A browser-based viewer making 3DGS accessible without GPU or installation
- Key finding: capture quality at collection time dominates reconstruction quality more than algorithmic choice; DUSt3R closes the gap significantly below 20 images

---

## 1. Introduction (~0.5 page)
- 3DGS (Kerbl et al. 2023) achieves real-time photorealistic rendering but assumes controlled, high-quality image capture
- In practice: phone cameras, casual movement, imperfect lighting — does 3DGS still work?
- Existing papers evaluate on controlled benchmark datasets (Tanks & Temples, Mip-NeRF 360) — not casual phone captures
- Gap: no systematic study of how capture conditions affect reconstruction quality in casual settings
- We fill this gap with controlled experiments across image count, lighting, texture, and capture path
- Secondary contribution: few-shot alternative (DUSt3R) that skips COLMAP entirely — when is it good enough?
- Research questions:
  1. How does image count, lighting, texture, and capture path affect 3DGS reconstruction quality?
  2. What are the failure modes and can they be predicted before reconstruction?
  3. At what image count does DUSt3R become competitive with the full COLMAP+Splatfacto pipeline?
  4. Can the reconstructed scene be deployed in a browser accessible to anyone?

---

## 2. Related Work (~1 page)

### 2.1 Structure from Motion
- Classical multi-view geometry: estimating camera poses from feature correspondences across images
- COLMAP [Schönberger & Frahm, CVPR 2016]: general-purpose SfM/MVS pipeline, the standard baseline for pose estimation
- Limitation: requires many images with sufficient overlap; fails on low-texture scenes

### 2.2 Neural Radiance Fields
- NeRF [Mildenhall et al., ECCV 2020]: neural implicit scene representation for novel view synthesis
- High quality but slow (~minutes per frame) — not suitable for real-time browser viewing
- Motivates 3DGS as a faster, explicit alternative

### 2.3 3D Gaussian Splatting
- Kerbl et al. [SIGGRAPH 2023]: represent scene as optimized 3D Gaussians, render via visibility-aware splatting
- Real-time performance (≥30 FPS at 1080p); initialized from COLMAP sparse points
- Nerfstudio Splatfacto: training implementation used in this project
- Key limitation: inherits COLMAP's failure modes — low texture, insufficient overlap, moving objects

### 2.4 Few-Shot and Pose-Free Reconstruction
- DUSt3R [Wang et al., CVPR 2024]: end-to-end 3D reconstruction from as few as 2 images, no camera poses required
- MASt3R [Leroy et al., 2024]: successor to DUSt3R with improved matching
- Key difference from COLMAP: jointly estimates geometry and poses in a single forward pass
- Relevant because it offers a low-barrier alternative for casual capture with few images

### 2.5 Browser-Based 3D Visualization
- gsplat: WebGL Gaussian splat renderer enabling in-browser viewing of .ply/.splat files
- Enables deployment without GPU, Python, or specialized software — key for accessibility

---

## 3. Method (~1.5 pages)

### 3.1 Capture Protocol
- Device: phone camera (specify model and resolution)
- Path: smooth arc or figure-8 around the scene, one step per frame
- Overlap target: 60–80% between consecutive frames
- Image counts tested: 10, 20, 50, 100 per scene

### 3.2 Pre-Capture Validation (validate_images.py)
- Blur: Laplacian variance (threshold 100) — predicts SIFT feature density
- Brightness: mean grayscale (reject < 40 dark, > 220 overexposed)
- Resolution: minimum 1280×720
- Count warning: < 30 images flagged as insufficient
- Output: JSON report + HTML summary; runs before reconstruction to catch bad captures early

### 3.3 Preprocessing (preprocess_images.py)
- Consistent renaming: frame_0001.jpg, frame_0002.jpg …
- Optional downsampling (--max-size 1920) to reduce GPU memory

### 3.4 Full Pipeline: COLMAP + Splatfacto
- ns-process-data: SIFT feature extraction → exhaustive matching → bundle adjustment → transforms.json
- ns-train splatfacto: initialize Gaussians from sparse points, optimize position/covariance/opacity/SH color
- ns-export gaussian-splat: export .ply for browser viewer
- Metric collected: registered cameras, training loss curve, qualitative score 1–5

### 3.5 Few-Shot Alternative: DUSt3R
- Run DUSt3R on same scenes at 5, 10, 20 image subsets
- No COLMAP, no pose estimation — single forward pass produces point cloud
- Compare output quality vs. full pipeline at matching image counts
- Research question: below what image count does DUSt3R become competitive?

### 3.6 Browser Deployment
- .ply hosted on HuggingFace (CORS-enabled CDN)
- gsplat WebGL viewer embedded in React landing page
- Orbit controls, progress bar, mobile-compatible
- No GPU, no installation — anyone with a browser can explore the scene

---

## 4. Experiments (~1 page)

### 4.1 Scenes
| Scene | Type | Purpose |
|---|---|---|
| Desk/shelf | High texture, cluttered | Baseline success case |
| Hallway/room | Medium texture, larger space | Mid-difficulty case |
| Blank wall | Very low texture | Expected failure |
| Dim desk | Same as desk, lights off | Lighting experiment |
| Random shots | Same scene, disconnected photos | Path experiment |

### 4.2 Experiment 1 — Image Count (Full Pipeline)
- Same scene, vary images: 10 / 20 / 50 / 100
- Metric: registered cameras, qualitative score, splat file size, browser load time
- Expected finding: below ~30 images reconstruction degrades significantly

### 4.3 Experiment 2 — Texture Level
- High texture (desk) vs. very low texture (blank wall)
- Metric: COLMAP registered cameras (binary success/fail), qualitative score
- Expected finding: low texture always fails at COLMAP stage

### 4.4 Experiment 3 — Lighting
- Bright vs. dim capture of same scene
- Metric: blur scores from validator, registered cameras, qualitative score
- Expected finding: dim → higher blur scores → fewer registered cameras

### 4.5 Experiment 4 — Capture Path
- Smooth arc vs. random disconnected shots (same scene, same count)
- Metric: registered cameras, fragmentation in COLMAP output, qualitative score
- Expected finding: random shots produce fragmented or failed reconstruction

### 4.6 Experiment 5 — DUSt3R vs. Full Pipeline (Key Experiment)
- Same scenes, same image subsets: 5 / 10 / 20 images
- DUSt3R output vs. Splatfacto output at matching counts
- Metric: qualitative score, point cloud density, completeness
- Expected finding: DUSt3R competitive or better below ~15 images; full pipeline wins above ~30
- This is the novel comparison — not done in either paper

---

## 5. Results (~0.5 page)
- Summary table across all experiments with real numbers
- Capture quality finding: blur score and registered camera count are the best predictors of output quality
- Image count finding: 50 images is the practical minimum for room-scale scenes
- DUSt3R finding: [fill in after running]
- Browser performance: load time vs. file size across scenes

---

## 6. Failure Case Taxonomy (~0.5 page)
Systematic categorization — each with image example and explanation:

| Failure Mode | Cause | Detection | Mitigation |
|---|---|---|---|
| COLMAP cannot initialize | Low texture — no SIFT keypoints | Blur/texture pre-check | Choose scenes with objects |
| Partial reconstruction | Insufficient overlap between views | Camera count < image count | Slower capture, more overlap |
| Floaters | Inconsistent appearance (reflections) | Visual inspection | Avoid mirrors, glass |
| Ghosting | Moving objects during capture | Temporal consistency check | Clear scene before capture |
| Color artifacts | Mixed lighting across frames | Brightness variance check | Consistent lighting |

This taxonomy is a practical contribution — not present in existing 3DGS papers.

---

## 7. Limitations (~0.25 page)
- No quantitative ground truth (PSNR/SSIM requires reference images from exact same viewpoints)
- DUSt3R comparison is qualitative — quantitative comparison requires reference geometry
- GPU required for Splatfacto training (~45–90 min per scene on T4)
- 3DGS assumes static scene — dynamic objects not handled

---

## 8. Conclusion (~0.25 page)
- Casual phone capture can produce high-quality interactive 3D scenes under the right conditions
- Capture quality factors (texture, overlap, lighting) predict success better than image count alone
- DUSt3R is a viable alternative for low-image-count scenarios, especially below 20 images
- Browser deployment removes the GPU/installation barrier — making 3DGS practically accessible
- Future work: video input for frame extraction, user-upload pipeline, mobile-optimized training
