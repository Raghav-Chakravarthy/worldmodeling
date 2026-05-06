# PhotoWalk — 5-Minute Video Script

---

## 0:00 – 0:30 | Introduction

> "What if you could walk through a room you photographed with your phone?
> That's the question behind PhotoWalk."

Hi, I'm [name], and this is my Computer Vision final project.
PhotoWalk is a pipeline that takes a set of ordinary phone photos and turns them
into an interactive, walkable 3D scene you can explore in a browser — no special hardware required.

---

## 0:30 – 1:00 | Motivation

Reconstructing 3D scenes from images has been a core problem in computer vision for decades.
Tools like COLMAP and 3D Gaussian Splatting now make it possible — but all existing papers
evaluate on carefully controlled benchmark datasets with tripod-mounted cameras and consistent lighting.

Nobody has systematically studied what happens with casual phone capture: too few images,
bad lighting, low-texture walls, disconnected shots.

We fill that gap empirically. And we ask a second question: is there an easier alternative?
DUSt3R is a 2024 CVPR method that reconstructs from as few as 2 images with no pose estimation at all.
When is that good enough?

---

## 1:00 – 2:00 | Method

The pipeline has six stages.

**First**, I capture 50 to 100 overlapping phone images, moving in a slow arc around the scene.

**Second**, a Python validation script checks each image for blur, brightness, and resolution —
and warns me before I waste hours on a bad dataset.

**Third**, preprocessing renames and optionally resizes the images for consistent input.

**Fourth**, COLMAP — run through Nerfstudio's ns-process-data command — estimates camera poses
using SIFT feature matching and bundle adjustment, producing a sparse 3D point cloud.

**Fifth**, Nerfstudio's Splatfacto trains a 3D Gaussian Splat scene, which represents the scene
as millions of optimized 3D Gaussians that render in real time.

**Sixth**, I export the scene as a .ply file and publish it using SuperSplat — a browser-based
viewer that requires no server setup.

---

## 2:00 – 3:30 | Demo

[Switch to browser]

Here's the first scene — my desk. I captured 50 images.
[Fly through the scene in the SuperSplat viewer]

You can see the books, lamp, and objects are reconstructed cleanly.
The detail holds up well even from novel viewpoints we never photographed.

[Switch to second scene]

This is the hallway scene, also 50 images.
The geometry is reasonable, but you can see the ceiling is patchy — we didn't have enough
upward-looking images.

[Switch to third case]

Now here's the failure case: a blank white wall.
COLMAP couldn't estimate any camera poses — there are simply no distinctive features to match.
No point cloud, no Gaussians, no reconstruction.

---

## 3:30 – 4:30 | Experiments & Findings

I ran five controlled experiments.

**Image count**: With 20 images, the desk scene has large geometric gaps.
With 50, it's mostly complete. Going to 100 shows diminishing returns — more file size,
more compute, but only marginal quality improvement.

**Texture**: This is the single strongest predictor. Textured scenes always reconstruct.
Low-texture scenes always fail. The underlying reason is that SfM relies on matching
distinctive feature points — blank surfaces have none.

**Lighting**: Dim images reduce the number of registered cameras by about 30%,
because feature detection degrades under noise and motion blur.

**Capture path**: A smooth circular arc with 70% overlap consistently reconstructs.
A set of disconnected random shots from the same room produces fragmented or failed geometry,
even with the same scene and same number of images.

**DUSt3R comparison — the novel experiment**: We ran DUSt3R on the same scenes using
only 5, 10, and 20 images — no COLMAP, no pose estimation, just a single forward pass.
[Show side-by-side comparison]
Below about 15 images, DUSt3R produces competitive or better point clouds than COLMAP+Splatfacto.
Above 30 images, the full pipeline clearly wins in detail and completeness.
This comparison doesn't exist in either paper — it's the main research contribution here.

---

## 4:30 – 5:00 | Conclusion

PhotoWalk makes three contributions:

First, an empirical answer to when casual 3DGS reconstruction works — and the failure taxonomy
tells you exactly why it failed when it doesn't.

Second, a data point for practitioners: if you have fewer than 15 images, skip COLMAP entirely and use DUSt3R.
If you have 50+, the full pipeline produces noticeably better results.

Third, a browser-accessible path that requires no GPU, no Python, and no installation on the viewer's side.

All code, data, and the hosted interactive scenes are available in the project repository.

Thank you.

---

## Slide Cues

| Time | Slide / Visual |
|---|---|
| 0:00 | Title card: PhotoWalk |
| 0:30 | Motivation: fragmentation diagram |
| 1:00 | Pipeline diagram (6 steps) |
| 1:20 | validate_images.py output screenshot |
| 1:40 | COLMAP sparse point cloud screenshot |
| 2:00 | Browser — desk scene viewer |
| 2:40 | Browser — hallway scene viewer |
| 3:00 | Browser/screenshot — blank wall failure |
| 3:30 | Results table: image count |
| 3:45 | Results table: texture |
| 4:00 | Results table: lighting |
| 4:15 | Results table: capture path |
| 4:20 | DUSt3R side-by-side comparison (5/10/20 images) |
| 4:30 | Summary: three contributions |
| 4:50 | Repository / demo link |
