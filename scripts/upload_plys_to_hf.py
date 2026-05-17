"""Upload the trained .ply Gaussian-Splat files to a HuggingFace dataset repo.

The web landing page (web/src/data/scenes.js) streams the splats directly from
huggingface.co so teammates can `git clone` and `npm run dev` without first
needing the 380 MB of local .ply files.

One-time setup for the user running this script:

    pip install huggingface_hub
    export HF_TOKEN=hf_xxx          # token with 'write' scope on the target repo
                                    # (or: huggingface-cli login)
    python scripts/upload_plys_to_hf.py --dry-run
    python scripts/upload_plys_to_hf.py --execute

After the upload, set HF_REPO at the top of web/src/data/scenes.js to the same
repo id you uploaded to (e.g. "your-username/photowalk-splats").
"""

from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

DEFAULT_REPO = "vcraghav/photowalk-splats"
DEFAULT_PLY_DIR = Path("web/public/plys")
EXPECTED_FILES = [
    "splatfacto_10k.ply",
    "inria_3dgs_point_cloud.ply",
    "mip_splatting_output.ply",
]


def resolve_token(cli_token: str | None) -> str:
    if cli_token:
        return cli_token
    env_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_HUB_TOKEN")
    if env_token:
        return env_token
    raise SystemExit(
        "No HuggingFace token found. Either pass --token, set HF_TOKEN, or run "
        "`huggingface-cli login` and re-run this script."
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--repo", default=DEFAULT_REPO,
                        help=f"HuggingFace dataset repo id (default: {DEFAULT_REPO})")
    parser.add_argument("--ply-dir", type=Path, default=DEFAULT_PLY_DIR,
                        help=f"Directory containing .ply files (default: {DEFAULT_PLY_DIR})")
    parser.add_argument("--token", default=None,
                        help="HuggingFace token. Falls back to HF_TOKEN env var.")
    parser.add_argument("--private", action="store_true",
                        help="Create the dataset as private. Default is public (required for web app to fetch without auth).")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true",
                      help="Print what would be uploaded without contacting HuggingFace.")
    mode.add_argument("--execute", action="store_true",
                      help="Actually create the repo and upload the .ply files.")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
    log = logging.getLogger("upload_plys")

    ply_dir: Path = args.ply_dir.resolve()
    if not ply_dir.is_dir():
        log.error("PLY directory does not exist: %s", ply_dir)
        return 1

    found = []
    missing = []
    for name in EXPECTED_FILES:
        p = ply_dir / name
        if p.is_file():
            found.append(p)
        else:
            missing.append(name)
    if missing:
        log.error("Missing expected .ply files in %s: %s", ply_dir, ", ".join(missing))
        log.error("Train + export the missing models first, then re-run this script.")
        return 1

    total_mb = sum(p.stat().st_size for p in found) / (1024 * 1024)
    log.info("Target repo:   %s  (%s)", args.repo, "private" if args.private else "public")
    log.info("Source folder: %s", ply_dir)
    log.info("Files to upload (%d, %.1f MB total):", len(found), total_mb)
    for p in found:
        log.info("  %-32s  %7.1f MB", p.name, p.stat().st_size / (1024 * 1024))

    if args.dry_run:
        log.info("Dry run — nothing uploaded. Re-run with --execute to perform upload.")
        return 0

    try:
        from huggingface_hub import HfApi, create_repo
    except ImportError:
        log.error("huggingface_hub not installed. Run: pip install huggingface_hub")
        return 1

    token = resolve_token(args.token)
    api = HfApi(token=token)

    log.info("Ensuring dataset repo exists…")
    create_repo(
        repo_id=args.repo,
        repo_type="dataset",
        token=token,
        private=args.private,
        exist_ok=True,
    )

    for p in found:
        log.info("Uploading %s …", p.name)
        api.upload_file(
            path_or_fileobj=str(p),
            path_in_repo=p.name,
            repo_id=args.repo,
            repo_type="dataset",
            token=token,
            commit_message=f"Upload {p.name}",
        )
        log.info("  ✓ %s", p.name)

    base = f"https://huggingface.co/datasets/{args.repo}/resolve/main"
    log.info("Done. Public resolve URLs:")
    for p in found:
        log.info("  %s/%s", base, p.name)
    log.info(
        "\nNext step: set HF_REPO at the top of web/src/data/scenes.js to:\n  \"%s\"",
        args.repo,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
