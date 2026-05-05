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
But in 2024, with phone cameras that shoot at 4K and open-source tools like COLMAP and
3D Gaussian Splatting, it's finally possible to do this casually — if you know how.

The problem is: the tools are fragmented, the failure modes are not well documented, and
there's no clear guide for when casual capture works and when it doesn't.

PhotoWalk tries to answer that question empirically.

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

I ran four controlled experiments.

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

---

## 4:30 – 5:00 | Conclusion

PhotoWalk shows that casual phone-based 3D reconstruction is practical — under the right conditions.

The key insight is: **image quality at capture time matters more than algorithm choice.**
More images help, but only if they add distinct viewpoints. Good lighting, textured scenes,
and smooth capture paths are the three most important factors.

The whole pipeline — from raw images to a hosted browser viewer — runs on a single consumer GPU
and costs nothing beyond electricity.

All code, data, and the hosted scenes are available in the project repository.

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
| 4:30 | Summary slide |
| 4:50 | Repository / demo link |
