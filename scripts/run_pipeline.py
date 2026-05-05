"""
run_pipeline.py — Orchestrate the full PhotoWalk reconstruction pipeline.

Usage:
    python scripts/run_pipeline.py --scene desk_scene --input scenes/desk_scene/raw --dry-run
    python scripts/run_pipeline.py --scene desk_scene --input scenes/desk_scene/raw --execute
    python scripts/run_pipeline.py --scene desk_scene --input scenes/desk_scene/raw --execute --max-size 1920
"""

import argparse
import json
import logging
import subprocess
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

# ── Project layout ──────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"


def run(cmd: list[str], execute: bool, cwd: Path | None = None):
    """Print a command and optionally run it."""
    display = " ".join(str(c) for c in cmd)
    if execute:
        log.info("Running: %s", display)
        result = subprocess.run(cmd, cwd=cwd)
        if result.returncode != 0:
            log.error("Command failed with exit code %d", result.returncode)
            sys.exit(result.returncode)
    else:
        print(f"  [DRY RUN] {display}")


def step_validate(scene_dir: Path, raw_dir: Path, execute: bool):
    print("\n=== Step 1: Validate images ===")
    metrics_dir = scene_dir / "metrics"
    validation_json = metrics_dir / "validation.json"
    cmd = [
        sys.executable, str(SCRIPTS_DIR / "validate_images.py"),
        "--input", str(raw_dir),
        "--output", str(validation_json),
    ]
    run(cmd, execute)

    if execute and validation_json.exists():
        with open(validation_json) as f:
            report = json.load(f)
        if report.get("warnings"):
            print("\n  Warnings from validation:")
            for w in report["warnings"]:
                print(f"    ! {w}")
            print()


def step_preprocess(scene_dir: Path, raw_dir: Path, max_size: int | None, execute: bool):
    print("\n=== Step 2: Preprocess images ===")
    processed_dir = scene_dir / "processed"
    cmd = [
        sys.executable, str(SCRIPTS_DIR / "preprocess_images.py"),
        "--input", str(raw_dir),
        "--output", str(processed_dir),
    ]
    if max_size:
        cmd += ["--max-size", str(max_size)]
    run(cmd, execute)
    return processed_dir


def step_ns_process(scene_dir: Path, processed_dir: Path, execute: bool):
    print("\n=== Step 3: COLMAP / Nerfstudio data processing ===")
    ns_data_dir = scene_dir / "nerfstudio_data"
    cmd = [
        "ns-process-data", "images",
        "--data", str(processed_dir),
        "--output-dir", str(ns_data_dir),
    ]
    run(cmd, execute)
    print(
        "\n  After this step, Nerfstudio generates transforms.json in:\n"
        f"    {ns_data_dir}\n"
    )
    return ns_data_dir


def step_train(scene_dir: Path, ns_data_dir: Path, execute: bool):
    print("\n=== Step 4: Train Splatfacto (3D Gaussian Splatting) ===")
    cmd = [
        "ns-train", "splatfacto",
        "--data", str(ns_data_dir),
        "--output-dir", str(scene_dir / "nerfstudio_outputs"),
    ]
    run(cmd, execute)
    print(
        "\n  Training saves checkpoints and a config.yml to:\n"
        f"    {scene_dir / 'nerfstudio_outputs' / '<scene>' / 'splatfacto' / '<timestamp>'}\n"
        "  Look for config.yml in that timestamped folder before running export.\n"
    )


def step_export(scene_dir: Path, execute: bool):
    print("\n=== Step 5: Export Gaussian Splat ===")
    export_dir = scene_dir / "exports" / "splat"
    config_placeholder = scene_dir / "nerfstudio_outputs" / "<scene>" / "splatfacto" / "<timestamp>" / "config.yml"
    cmd = [
        "ns-export", "gaussian-splat",
        "--load-config", str(config_placeholder),
        "--output-dir", str(export_dir),
    ]
    if execute:
        # Find the actual config.yml automatically
        outputs_dir = scene_dir / "nerfstudio_outputs"
        config_candidates = list(outputs_dir.glob("**/config.yml"))
        if not config_candidates:
            log.error(
                "No config.yml found under %s\n"
                "  Make sure training completed successfully.\n"
                "  Then run: ns-export gaussian-splat --load-config <path/to/config.yml> --output-dir %s",
                outputs_dir, export_dir,
            )
            sys.exit(1)
        # Use the most recently modified config
        config_path = max(config_candidates, key=lambda p: p.stat().st_mtime)
        log.info("Found config.yml at: %s", config_path)
        cmd = [
            "ns-export", "gaussian-splat",
            "--load-config", str(config_path),
            "--output-dir", str(export_dir),
        ]
        run(cmd, execute)
    else:
        run(cmd, execute)

    print(
        f"\n  The exported .ply file will be in: {export_dir}\n"
        "  Open it in SuperSplat: https://playcanvas.com/supersplat/editor\n"
        "  Or use the local viewer: web/viewer.html\n"
    )


def main():
    parser = argparse.ArgumentParser(description="PhotoWalk reconstruction pipeline.")
    parser.add_argument("--scene", required=True, help="Scene name (e.g. desk_scene).")
    parser.add_argument("--input", required=True, type=Path, help="Folder of raw images.")
    parser.add_argument("--max-size", type=int, default=None, help="Max image dimension for preprocessing.")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true", help="Print commands without executing.")
    mode.add_argument("--execute", action="store_true", help="Execute the full pipeline.")
    parser.add_argument(
        "--skip-to", choices=["validate", "preprocess", "ns-process", "train", "export"],
        default=None, help="Skip steps before this one (useful for resuming).",
    )
    args = parser.parse_args()

    if not args.input.is_dir():
        log.error("Input directory not found: %s", args.input)
        sys.exit(1)

    execute = args.execute
    scene_dir = PROJECT_ROOT / "scenes" / args.scene
    scene_dir.mkdir(parents=True, exist_ok=True)
    (scene_dir / "metrics").mkdir(exist_ok=True)
    (scene_dir / "exports").mkdir(exist_ok=True)

    skip_order = ["validate", "preprocess", "ns-process", "train", "export"]
    skip_idx = skip_order.index(args.skip_to) if args.skip_to else 0

    print(f"\nPhotoWalk pipeline — scene: {args.scene}")
    print(f"Mode: {'EXECUTE' if execute else 'DRY RUN'}")
    print(f"Input: {args.input}")
    if args.skip_to:
        print(f"Skipping to: {args.skip_to}")

    processed_dir = scene_dir / "processed"
    ns_data_dir = scene_dir / "nerfstudio_data"

    if skip_idx <= 0:
        step_validate(scene_dir, args.input, execute)
    if skip_idx <= 1:
        processed_dir = step_preprocess(scene_dir, args.input, args.max_size, execute)
    if skip_idx <= 2:
        ns_data_dir = step_ns_process(scene_dir, processed_dir, execute)
    if skip_idx <= 3:
        step_train(scene_dir, ns_data_dir, execute)
    if skip_idx <= 4:
        step_export(scene_dir, execute)

    print("\nPipeline complete.")
    if not execute:
        print("Re-run with --execute to run the actual commands.\n")


if __name__ == "__main__":
    main()
