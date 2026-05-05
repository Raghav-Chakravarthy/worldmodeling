# Related Work — Draft Notes

## Structure from Motion

Structure from Motion (SfM) recovers camera poses and sparse 3D geometry from a collection of images.
The classical pipeline extracts 2D feature points (typically SIFT), matches them across image pairs,
estimates fundamental matrices, and refines all camera parameters jointly via bundle adjustment.

**COLMAP** [Schönberger & Frahm, CVPR 2016; Schönberger et al., ECCV 2016] is the standard open-source
SfM and Multi-View Stereo pipeline. It supports both ordered (video) and unordered (photo collection)
inputs and exposes both a GUI and a command-line interface. Nerfstudio's `ns-process-data` command
uses COLMAP internally to produce the `transforms.json` camera pose file required for downstream training.

## Neural Radiance Fields

NeRF [Mildenhall et al., ECCV 2020] represents a scene as a continuous volumetric function mapping
(x, y, z, θ, φ) → (color, density), encoded in a neural network. Novel views are synthesized by
volume rendering along camera rays. NeRF produces high-quality results but requires minutes per frame
to render, making it impractical for real-time interactive use.

## 3D Gaussian Splatting

Kerbl et al. [SIGGRAPH 2023] propose representing scenes as a collection of 3D Gaussians, each
parameterized by position, covariance (shape/orientation), opacity, and spherical harmonic color
coefficients. Rendering proceeds via visibility-aware splatting: Gaussians are sorted by depth and
alpha-composited into the image plane. The method achieves real-time frame rates (≥30 FPS at 1080p)
while matching or exceeding NeRF quality on standard benchmarks.

Crucially, 3DGS is initialized from the sparse point cloud produced by COLMAP, making it a natural
extension of the classical SfM pipeline. The scene is exported as a `.ply` file, which can be loaded
by browser-side viewers.

**Nerfstudio Splatfacto** is Nerfstudio's implementation of 3DGS training. It provides a clean
`ns-train splatfacto` command and an `ns-export gaussian-splat` export step, making the method
accessible without modifying the original C++/CUDA codebase.

## Browser-Based 3D Visualization

**SuperSplat** (PlayCanvas) is a browser-based editor and publisher for Gaussian splat `.ply` files.
It supports loading, compressing, and publishing splat files as hosted interactive viewers — no server
infrastructure required. Its documentation explicitly describes exporting self-hostable HTML viewers.

**Three.js gaussian-splatting** libraries (e.g., antimatter15/splat, mkkellogg/GaussianSplats3D) allow
embedding Gaussian splat viewers directly in web pages via WebGL, with WASD fly-camera controls.
These are an alternative to SuperSplat when more control over the viewer UI is needed.

## Citations (to format in NeurIPS style)

- Schönberger, J. L., & Frahm, J.-M. (2016). Structure-from-motion revisited. CVPR.
- Schönberger, J. L., Price, T., Sattler, T., Frahm, J.-M., & Pollefeys, M. (2016). A vote-and-verify strategy for fast spatial verification in image retrieval. ACCV.
- Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R. (2020). NeRF: Representing scenes as neural radiance fields for view synthesis. ECCV.
- Kerbl, B., Kopanas, G., Leimkühler, T., & Drettakis, G. (2023). 3D Gaussian splatting for real-time radiance field rendering. ACM Transactions on Graphics (SIGGRAPH).
- Nerfstudio Team. (2023). Nerfstudio: A modular framework for neural radiance field development. SIGGRAPH.
