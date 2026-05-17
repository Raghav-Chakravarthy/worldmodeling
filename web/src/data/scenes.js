// Three open-source 3D Gaussian Splatting trainers, each trained for 10,000
// iterations on the gerrard-hall scene (COLMAP poses + sparse points, Colab T4).
// PLY files are streamed from a public HuggingFace dataset so teammates can
// `git clone` + `npm run dev` without needing the ~380 MB of local .ply files.
// To re-host: run `python scripts/upload_plys_to_hf.py --execute`, then set
// HF_REPO below to whatever repo id you uploaded to.
const HF_REPO = "pjain125/photowalk-splats";
const HF_BASE = `https://huggingface.co/datasets/${HF_REPO}/resolve/main`;

export const scenes = [
  {
    id: "splatfacto",
    title: "Splatfacto (Nerfstudio)",
    description: "Production-oriented 3DGS trainer wrapped in Nerfstudio. Our baseline — what most practitioners actually run.",
    difficulty: "Baseline",
    difficultyColor: "text-blue-600 bg-blue-50",
    psnr: 20.25,
    ssim: 0.712,
    lpips: 0.337,
    numGaussians: 312426,
    trainTimeMin: 9.45,
    peakGpuGb: 2.21,
    fileSizeMb: 77.5,
    fps: 68.7,
    splat_url: `${HF_BASE}/splatfacto_10k.ply`,
    demo_label: "Splatfacto · Nerfstudio 1.1.5 · 10k iters on gerrard-hall · PSNR 20.25 / SSIM 0.71 / LPIPS 0.34",
    thumbnail: null,
  },
  {
    id: "inria_3dgs",
    title: "Inria 3DGS",
    description: "The original 3D Gaussian Splatting implementation from the SIGGRAPH 2023 paper. Canonical reference for every follow-up.",
    difficulty: "Reference",
    difficultyColor: "text-purple-600 bg-purple-50",
    psnr: 19.38,
    ssim: 0.683,
    lpips: 0.381,
    numGaussians: 578669,
    trainTimeMin: 24.26,
    peakGpuGb: 8.94,
    fileSizeMb: 143.5,
    fps: null,
    splat_url: `${HF_BASE}/inria_3dgs_point_cloud.ply`,
    demo_label: "Inria 3DGS (Kerbl et al., 2023) · 10k iters on gerrard-hall · PSNR 19.38 / SSIM 0.68 / LPIPS 0.38",
    thumbnail: null,
  },
  {
    id: "mip_splatting",
    title: "Mip-Splatting",
    description: "CVPR 2024 follow-up that adds 3D smoothing + 2D Mip filters to reduce aliasing and flicker without changing the Gaussian representation.",
    difficulty: "Quality follow-up",
    difficultyColor: "text-emerald-600 bg-emerald-50",
    psnr: 19.40,
    ssim: 0.679,
    lpips: 0.385,
    numGaussians: 699425,
    trainTimeMin: 9.80,
    peakGpuGb: 16.75,
    fileSizeMb: 176.3,
    fps: null,
    splat_url: `${HF_BASE}/mip_splatting_output.ply`,
    demo_label: "Mip-Splatting (Yu et al., 2024) · 10k iters on gerrard-hall · PSNR 19.40 / SSIM 0.68 / LPIPS 0.38",
    thumbnail: null,
  },
];

export const experiments = [
  {
    variable: "Image Count",
    low: "20 images → Incomplete geometry, many gaps",
    high: "100 images → Diminishing returns, higher compute",
    sweet_spot: "50–70 images for most indoor scenes",
    finding: "More images improve coverage but only if they add distinct viewpoints. Near-duplicates hurt efficiency without improving quality.",
  },
  {
    variable: "Texture Level",
    low: "Blank wall → SfM fails entirely",
    high: "Cluttered desk → Clean reconstruction",
    sweet_spot: "Any scene with distinctive features at multiple depths",
    finding: "Feature matching is the bottleneck. Low-texture regions produce no sparse points and prevent camera pose estimation.",
  },
  {
    variable: "Lighting",
    low: "Dim room → Blurry images, few features",
    high: "Bright daylight → Clear features, fast matching",
    sweet_spot: "Consistent bright indoor or outdoor (overcast) light",
    finding: "Dark images increase noise and reduce feature count. Mixed lighting creates color inconsistencies in the final splat.",
  },
  {
    variable: "Capture Path",
    low: "Random disconnected shots → Fragmented reconstruction",
    high: "Smooth circular arc with 70% overlap → Stable, complete geometry",
    sweet_spot: "Slow, deliberate arc or figure-8 path around the scene",
    finding: "COLMAP relies on sequential image similarity to initialize. Disconnected viewpoints often cause partial or failed reconstruction.",
  },
];
