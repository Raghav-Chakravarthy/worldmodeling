"""
preprocess_images.py — Rename, resize, and copy images before reconstruction.

Usage:
    python scripts/preprocess_images.py --input scenes/desk_scene/raw --output scenes/desk_scene/processed
    python scripts/preprocess_images.py --input scenes/desk_scene/raw --output scenes/desk_scene/processed --max-size 1920
"""

import argparse
import logging
import shutil
import sys
from pathlib import Path

import cv2

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".bmp", ".tiff"}
OUTPUT_EXT = ".jpg"
OUTPUT_QUALITY = 95  # JPEG quality


def resize_if_needed(img, max_size: int):
    """Downscale so that the longer edge does not exceed max_size."""
    h, w = img.shape[:2]
    longer = max(h, w)
    if longer <= max_size:
        return img
    scale = max_size / longer
    new_w = int(w * scale)
    new_h = int(h * scale)
    return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)


def preprocess(input_dir: Path, output_dir: Path, max_size: int | None, dry_run: bool):
    image_paths = sorted(
        p for p in input_dir.iterdir()
        if p.suffix.lower() in SUPPORTED_EXTS
    )

    if not image_paths:
        log.error("No supported images found in %s", input_dir)
        sys.exit(1)

    log.info("Found %d images in %s", len(image_paths), input_dir)

    if dry_run:
        log.info("[DRY RUN] Would write %d images to %s", len(image_paths), output_dir)
        for i, p in enumerate(image_paths):
            print(f"  {p.name} → frame_{i+1:04d}{OUTPUT_EXT}")
        return

    output_dir.mkdir(parents=True, exist_ok=True)

    skipped = 0
    written = 0
    for i, src_path in enumerate(image_paths):
        dest_name = f"frame_{i + 1:04d}{OUTPUT_EXT}"
        dest_path = output_dir / dest_name

        img = cv2.imread(str(src_path))
        if img is None:
            log.warning("Could not read %s — skipping.", src_path.name)
            skipped += 1
            continue

        if max_size:
            img = resize_if_needed(img, max_size)

        cv2.imwrite(str(dest_path), img, [cv2.IMWRITE_JPEG_QUALITY, OUTPUT_QUALITY])
        log.info("  %s → %s  (%dx%d)", src_path.name, dest_name, img.shape[1], img.shape[0])
        written += 1

    log.info("Done. Written: %d  Skipped: %d", written, skipped)


def main():
    parser = argparse.ArgumentParser(description="Preprocess images for 3D reconstruction.")
    parser.add_argument("--input", "-i", required=True, type=Path, help="Folder of raw images.")
    parser.add_argument("--output", "-o", required=True, type=Path, help="Output folder for processed images.")
    parser.add_argument(
        "--max-size", type=int, default=None,
        help="Resize so the longer edge does not exceed this value (e.g. 1920). Omit to keep original size.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print what would happen without writing files.")
    args = parser.parse_args()

    if not args.input.is_dir():
        log.error("Input path does not exist or is not a directory: %s", args.input)
        sys.exit(1)

    preprocess(args.input, args.output, args.max_size, args.dry_run)


if __name__ == "__main__":
    main()
