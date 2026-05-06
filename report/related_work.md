# Related Work — Draft Notes

## Structure from Motion

Structure from Motion (SfM) recovers camera poses and sparse 3D geometry from a collection of images.
The classical pipeline extracts 2D feature points (typically SIFT), matches them across image pairs,
estimates fundamental matrices, and refines all camera parameters jointly via bundle adjustment.

**COLMAP** [Schönberger & Frahm, CVPR 2016; Schönberger et al., ECCV 2016] is the standard open-source
SfM and Multi-View Stereo pipeline. It supports both ordered (video) and unordered (photo collection)
inputs and exposes both a GUI and command-line interface. Nerfstudio's `ns-process-data` command
uses COLMAP internally to produce the `transforms.json` camera pose file required for downstream training.

**Limitation relevant to this project:** COLMAP fails on low-texture surfaces because SIFT keypoint
detection requires distinctive local gradients. This is the primary failure mode in our experiments.

## Neural Radiance Fields

NeRF [Mildenhall et al., ECCV 2020] represents a scene as a continuous volumetric function mapping
(x, y, z, θ, φ) → (color, density), encoded in a neural network. Novel views are synthesized by
volume rendering along camera rays. NeRF produces high-quality results but requires minutes per frame
to render, making it impractical for real-time interactive use. We use NeRF as conceptual background
rather than a direct comparison — 3DGS is the practical successor for real-time applications.

## 3D Gaussian Splatting

Kerbl et al. [SIGGRAPH 2023] propose representing scenes as a collection of 3D Gaussians, each
parameterized by position, covariance (shape/orientation), opacity, and spherical harmonic color
coefficients. Rendering proceeds via visibility-aware splatting: Gaussians are sorted by depth and
alpha-composited into the image plane. The method achieves real-time frame rates (≥30 FPS at 1080p)
while matching or exceeding NeRF quality on standard benchmarks.

Crucially, 3DGS is initialized from the sparse point cloud produced by COLMAP, making it a natural
extension of the classical SfM pipeline. The scene is exported as a `.ply` file loadable by
browser-side viewers.

**Nerfstudio Splatfacto** [Tancik et al., SIGGRAPH 2023] is Nerfstudio's implementation of 3DGS
training, providing `ns-train splatfacto` and `ns-export gaussian-splat`.

**What existing 3DGS papers do NOT evaluate:** All major 3DGS benchmarks (Tanks & Temples, Mip-NeRF
360 scenes, DeepBlending) use controlled, high-quality captures — tripod-mounted cameras, consistent
lighting, no motion blur. Our work specifically evaluates what happens under casual phone capture,
filling this gap.

## Few-Shot and Pose-Free Reconstruction

**DUSt3R** [Wang et al., CVPR 2024] is an end-to-end 3D reconstruction method that takes as input
as few as 2 images and produces a dense 3D point map without requiring known camera poses. It jointly
solves for geometry and camera parameters using a transformer architecture trained on large-scale 3D
data. This eliminates the COLMAP dependency entirely — the primary failure bottleneck in our pipeline.

**MASt3R** [Leroy et al., 2024] extends DUSt3R with improved feature matching, enabling more
accurate reconstruction from few views.

**Relevance to this project:** DUSt3R represents an alternative approach to casual 3D capture.
While our primary pipeline uses COLMAP+Splatfacto (requiring 50+ images), DUSt3R can work with
3–10 images. We run a direct comparison to quantify the quality tradeoff — specifically:
*at what image count does DUSt3R become competitive with the full pipeline?*
This comparison is novel — neither the DUSt3R nor the 3DGS paper makes this comparison.

## Browser-Based 3D Visualization

**gsplat** is a WebGL Gaussian splat renderer that enables browser-based viewing of `.ply` and
`.splat` files with orbit controls and real-time rendering. It eliminates the requirement for
GPU hardware or local software installation on the viewer's side.

**Accessibility contribution:** The combination of cloud training (Google Colab) + HuggingFace
hosting + browser viewer creates a path from phone images to interactive 3D scene that requires
no local GPU, no Python environment, and no specialized software — only a modern web browser.
This is not addressed in existing 3DGS literature.

## Citations (format in NeurIPS style for report)

- Schönberger, J. L., & Frahm, J.-M. (2016). Structure-from-motion revisited. CVPR.
- Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R. (2020). NeRF: Representing scenes as neural radiance fields for view synthesis. ECCV.
- Kerbl, B., Kopanas, G., Leimkühler, T., & Drettakis, G. (2023). 3D Gaussian splatting for real-time radiance field rendering. ACM SIGGRAPH.
- Tancik, M., et al. (2023). Nerfstudio: A modular framework for neural radiance field development. ACM SIGGRAPH.
- Wang, S., Leroy, V., Cabon, Y., Chidlovskii, B., & Revaud, J. (2024). DUSt3R: Geometric 3D vision made easy. CVPR.
- Leroy, V., et al. (2024). MASt3R: Grounding Image Matching in 3D with MASt3R. arXiv.
