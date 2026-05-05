"""
validate_images.py — Check image quality before reconstruction.

Usage:
    python scripts/validate_images.py --input scenes/desk_scene/raw --output scenes/desk_scene/metrics/validation.json
    python scripts/validate_images.py --input data/raw  # uses default output path
"""

import argparse
import json
import logging
import os
import sys
from pathlib import Path

import cv2
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".bmp", ".tiff"}

MIN_IMAGES = 30
IDEAL_MIN_IMAGES = 50
BLUR_THRESHOLD = 100.0       # Laplacian variance below this = blurry
BRIGHTNESS_LOW = 40          # Mean grayscale below this = too dark
BRIGHTNESS_HIGH = 220        # Mean grayscale above this = overexposed
MIN_RESOLUTION = (1280, 720)  # width x height


def load_image(path: Path):
    img = cv2.imread(str(path))
    if img is None:
        log.warning("Could not read %s — skipping.", path.name)
    return img


def blur_score(img_gray: np.ndarray) -> float:
    """Laplacian variance — higher means sharper."""
    return float(cv2.Laplacian(img_gray, cv2.CV_64F).var())


def brightness_mean(img_gray: np.ndarray) -> float:
    return float(img_gray.mean())


def check_image(path: Path) -> dict:
    img = load_image(path)
    if img is None:
        return {"file": path.name, "valid": False, "error": "unreadable"}

    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = blur_score(gray)
    brightness = brightness_mean(gray)

    issues = []
    if w < MIN_RESOLUTION[0] or h < MIN_RESOLUTION[1]:
        issues.append("low_resolution")
    if blur < BLUR_THRESHOLD:
        issues.append("blurry")
    if brightness < BRIGHTNESS_LOW:
        issues.append("too_dark")
    if brightness > BRIGHTNESS_HIGH:
        issues.append("overexposed")

    return {
        "file": path.name,
        "valid": True,
        "width": w,
        "height": h,
        "blur_score": round(blur, 2),
        "brightness": round(brightness, 2),
        "issues": issues,
    }


def validate_folder(input_dir: Path) -> dict:
    image_paths = sorted(
        p for p in input_dir.iterdir()
        if p.suffix.lower() in SUPPORTED_EXTS
    )

    if not image_paths:
        log.error("No supported images found in %s", input_dir)
        sys.exit(1)

    log.info("Found %d images — analyzing...", len(image_paths))
    results = [check_image(p) for p in image_paths]
    valid_results = [r for r in results if r["valid"]]

    # Aggregate stats
    blur_scores = [r["blur_score"] for r in valid_results]
    brightness_vals = [r["brightness"] for r in valid_results]
    resolutions = [(r["width"], r["height"]) for r in valid_results]

    blurry = [r["file"] for r in valid_results if "blurry" in r["issues"]]
    dark = [r["file"] for r in valid_results if "too_dark" in r["issues"]]
    overexposed = [r["file"] for r in valid_results if "overexposed" in r["issues"]]
    low_res = [r["file"] for r in valid_results if "low_resolution" in r["issues"]]

    warnings = []
    if len(image_paths) < MIN_IMAGES:
        warnings.append(f"Only {len(image_paths)} images found — reconstruction may be unstable. Aim for {IDEAL_MIN_IMAGES}+.")
    if blurry:
        warnings.append(f"{len(blurry)} image(s) appear blurry (blur score < {BLUR_THRESHOLD}).")
    if dark:
        warnings.append(f"{len(dark)} image(s) are too dark (mean brightness < {BRIGHTNESS_LOW}).")
    if overexposed:
        warnings.append(f"{len(overexposed)} image(s) are overexposed (mean brightness > {BRIGHTNESS_HIGH}).")
    if low_res:
        warnings.append(f"{len(low_res)} image(s) are below minimum resolution {MIN_RESOLUTION}.")

    recommendations = [
        "Capture 50–100 overlapping images for stable reconstruction.",
        "Move slowly and smoothly around the scene in a circular or arc path.",
        "Ensure 60–80% overlap between consecutive frames.",
        "Avoid blank walls, mirrors, glass, and moving objects.",
        "Shoot in good, consistent lighting — avoid harsh shadows or mixed light sources.",
    ]

    avg_w = int(np.mean([r[0] for r in resolutions])) if resolutions else 0
    avg_h = int(np.mean([r[1] for r in resolutions])) if resolutions else 0

    report = {
        "input_dir": str(input_dir),
        "num_images": len(image_paths),
        "num_valid": len(valid_results),
        "num_unreadable": len(results) - len(valid_results),
        "average_resolution": [avg_w, avg_h],
        "blur_score_mean": round(float(np.mean(blur_scores)), 2) if blur_scores else 0,
        "blur_score_min": round(float(np.min(blur_scores)), 2) if blur_scores else 0,
        "brightness_mean": round(float(np.mean(brightness_vals)), 2) if brightness_vals else 0,
        "blurry_images": blurry,
        "dark_images": dark,
        "overexposed_images": overexposed,
        "low_resolution_images": low_res,
        "warnings": warnings,
        "recommendations": recommendations,
        "per_image": results,
    }

    return report


def save_visual_summary(report: dict, output_dir: Path):
    """Write a simple HTML summary alongside the JSON."""
    html_path = output_dir / "validation_summary.html"
    rows = ""
    for img in report["per_image"]:
        if not img["valid"]:
            continue
        issues = ", ".join(img["issues"]) or "OK"
        color = "#fee2e2" if img["issues"] else "#dcfce7"
        rows += (
            f'<tr style="background:{color}">'
            f'<td>{img["file"]}</td>'
            f'<td>{img["width"]}x{img["height"]}</td>'
            f'<td>{img["blur_score"]}</td>'
            f'<td>{img["brightness"]}</td>'
            f'<td>{issues}</td>'
            "</tr>\n"
        )

    warning_html = "".join(f"<li>{w}</li>" for w in report["warnings"]) or "<li>None</li>"
    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>PhotoWalk Validation</title>
<style>body{{font-family:sans-serif;padding:2em}}table{{border-collapse:collapse;width:100%}}
td,th{{border:1px solid #ccc;padding:6px 10px;text-align:left}}th{{background:#f3f4f6}}</style>
</head><body>
<h1>PhotoWalk Image Validation</h1>
<p><strong>Input:</strong> {report["input_dir"]}</p>
<p><strong>Images:</strong> {report["num_images"]} total / {report["num_valid"]} valid</p>
<p><strong>Avg resolution:</strong> {report["average_resolution"][0]}x{report["average_resolution"][1]}</p>
<p><strong>Avg blur score:</strong> {report["blur_score_mean"]} (higher = sharper)</p>
<p><strong>Avg brightness:</strong> {report["brightness_mean"]}</p>
<h2>Warnings</h2><ul>{warning_html}</ul>
<h2>Per-image results</h2>
<table><tr><th>File</th><th>Resolution</th><th>Blur</th><th>Brightness</th><th>Issues</th></tr>
{rows}</table>
</body></html>"""
    html_path.write_text(html, encoding="utf-8")
    log.info("HTML summary saved to %s", html_path)


def main():
    parser = argparse.ArgumentParser(description="Validate images before 3D reconstruction.")
    parser.add_argument("--input", "-i", required=True, type=Path, help="Folder of input images.")
    parser.add_argument("--output", "-o", type=Path, default=None, help="Output JSON path.")
    parser.add_argument("--no-html", action="store_true", help="Skip HTML summary.")
    args = parser.parse_args()

    if not args.input.is_dir():
        log.error("Input path does not exist or is not a directory: %s", args.input)
        sys.exit(1)

    report = validate_folder(args.input)

    out_path = args.output or args.input.parent / "metrics" / "validation.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    log.info("Validation report saved to %s", out_path)

    if not args.no_html:
        save_visual_summary(report, out_path.parent)

    # Print summary to console
    print("\n--- Validation Summary ---")
    print(f"  Images:        {report['num_images']} ({report['num_valid']} valid)")
    print(f"  Avg blur:      {report['blur_score_mean']} (threshold: {BLUR_THRESHOLD})")
    print(f"  Avg brightness:{report['brightness_mean']}")
    if report["warnings"]:
        print("\n  Warnings:")
        for w in report["warnings"]:
            print(f"    ! {w}")
    else:
        print("\n  No warnings — images look good.")
    print()


if __name__ == "__main__":
    main()
