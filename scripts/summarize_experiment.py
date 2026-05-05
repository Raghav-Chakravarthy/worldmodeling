"""
summarize_experiment.py — Aggregate experiment results across scenes into a Markdown/CSV table.

Usage:
    # Auto-discover all scenes with a metrics/validation.json:
    python scripts/summarize_experiment.py --scenes-dir scenes --output report/experiments.md

    # Use an explicit experiment manifest:
    python scripts/summarize_experiment.py --manifest experiments.json --output report/experiments.md
"""

import argparse
import csv
import json
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent

FIELDS = [
    "scene_name",
    "num_images",
    "capture_condition",
    "lighting",
    "texture_level",
    "reconstruction_success",
    "major_artifacts",
    "viewer_file_size_mb",
    "qualitative_score",
    "notes",
]

EXAMPLE_MANIFEST = [
    {
        "scene_name": "desk_scene_50",
        "capture_condition": "arc path, 60% overlap",
        "lighting": "bright indoor",
        "texture_level": "high",
        "reconstruction_success": "yes",
        "major_artifacts": "none",
        "viewer_file_size_mb": 42.3,
        "qualitative_score": 4,
        "notes": "Clean reconstruction with minor floaters near edges.",
    },
    {
        "scene_name": "hallway_20",
        "capture_condition": "arc path, 40% overlap",
        "lighting": "bright indoor",
        "texture_level": "medium",
        "reconstruction_success": "partial",
        "major_artifacts": "missing ceiling, floaters",
        "viewer_file_size_mb": 18.7,
        "qualitative_score": 3,
        "notes": "Too few images — ceiling not reconstructed.",
    },
    {
        "scene_name": "blank_wall",
        "capture_condition": "random",
        "lighting": "bright indoor",
        "texture_level": "very low",
        "reconstruction_success": "no",
        "major_artifacts": "COLMAP failed to estimate poses",
        "viewer_file_size_mb": 0,
        "qualitative_score": 1,
        "notes": "No distinctive features. SfM cannot initialize.",
    },
]


def load_validation(scene_dir: Path) -> dict:
    val_path = scene_dir / "metrics" / "validation.json"
    if val_path.exists():
        with open(val_path) as f:
            return json.load(f)
    return {}


def discover_scenes(scenes_dir: Path) -> list[dict]:
    rows = []
    for scene_dir in sorted(scenes_dir.iterdir()):
        if not scene_dir.is_dir():
            continue
        val = load_validation(scene_dir)
        row = {
            "scene_name": scene_dir.name,
            "num_images": val.get("num_images", "?"),
            "capture_condition": "—",
            "lighting": "—",
            "texture_level": "—",
            "reconstruction_success": "—",
            "major_artifacts": "—",
            "viewer_file_size_mb": _export_size(scene_dir),
            "qualitative_score": "—",
            "notes": "",
        }
        rows.append(row)
    return rows


def _export_size(scene_dir: Path) -> float:
    """Return total size of exports/ in MB, or 0 if not present."""
    exports = scene_dir / "exports"
    if not exports.exists():
        return 0.0
    total = sum(f.stat().st_size for f in exports.rglob("*") if f.is_file())
    return round(total / (1024 * 1024), 1)


def rows_to_markdown(rows: list[dict]) -> str:
    if not rows:
        return "_No experiment data found._\n"

    header = "| " + " | ".join(FIELDS) + " |"
    sep = "| " + " | ".join("---" for _ in FIELDS) + " |"
    lines = [header, sep]
    for row in rows:
        cells = [str(row.get(f, "—")) for f in FIELDS]
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines) + "\n"


def rows_to_csv(rows: list[dict], path: Path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    log.info("CSV saved to %s", path)


def main():
    parser = argparse.ArgumentParser(description="Summarize PhotoWalk experiments.")
    parser.add_argument("--scenes-dir", type=Path, default=PROJECT_ROOT / "scenes",
                        help="Directory containing scene subfolders (default: scenes/).")
    parser.add_argument("--manifest", type=Path, default=None,
                        help="JSON file with manually entered experiment rows (overrides auto-discovery).")
    parser.add_argument("--output", "-o", type=Path, default=PROJECT_ROOT / "report" / "experiments.md",
                        help="Output Markdown file path.")
    parser.add_argument("--csv", type=Path, default=None,
                        help="Also save a CSV copy to this path.")
    parser.add_argument("--init-manifest", action="store_true",
                        help="Write an example experiments.json to fill in and exit.")
    args = parser.parse_args()

    if args.init_manifest:
        manifest_path = PROJECT_ROOT / "experiments.json"
        manifest_path.write_text(json.dumps(EXAMPLE_MANIFEST, indent=2), encoding="utf-8")
        log.info("Example manifest written to %s — fill in your results and re-run.", manifest_path)
        return

    if args.manifest and args.manifest.exists():
        with open(args.manifest) as f:
            rows = json.load(f)
        log.info("Loaded %d rows from manifest %s", len(rows), args.manifest)
    else:
        if not args.scenes_dir.is_dir():
            log.error("Scenes directory not found: %s", args.scenes_dir)
            rows = []
        else:
            rows = discover_scenes(args.scenes_dir)
            log.info("Auto-discovered %d scenes in %s", len(rows), args.scenes_dir)

    md = "# PhotoWalk Experiment Results\n\n"
    md += rows_to_markdown(rows)
    md += "\n_Qualitative score: 1 (failed) – 5 (excellent). Fill in manually after reconstruction._\n"

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(md, encoding="utf-8")
    log.info("Markdown summary saved to %s", args.output)

    if args.csv:
        rows_to_csv(rows, args.csv)

    print("\nExperiment summary:\n")
    print(md)


if __name__ == "__main__":
    main()
