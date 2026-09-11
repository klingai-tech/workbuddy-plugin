#!/usr/bin/env python3

import json
import subprocess
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parent.parent


def is_macos_metadata(path):
    return any(
        part in {".DS_Store", "__MACOSX"} or part.startswith("._")
        for part in Path(path).parts
    )


def release_files(package):
    paths = {ROOT / "package.json"}
    for item in package["files"]:
        path = ROOT / item.rstrip("/")
        if path.is_file():
            paths.add(path)
        elif path.is_dir():
            paths.update(candidate for candidate in path.rglob("*") if candidate.is_file())
    return sorted(path for path in paths if not is_macos_metadata(path.relative_to(ROOT)))


def main():
    subprocess.run(["node", "scripts/verify-package.mjs"], cwd=ROOT, check=True)

    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    archive = ROOT / f"kling-workbuddy-v{package['version']}.zip"
    temporary_archive = archive.with_suffix(".zip.tmp")

    with ZipFile(temporary_archive, "w", ZIP_DEFLATED) as output:
        for path in release_files(package):
            output.write(path, path.relative_to(ROOT).as_posix())

    with ZipFile(temporary_archive) as output:
        forbidden = [
            name for name in output.namelist()
            if is_macos_metadata(name)
        ]
        if forbidden:
            temporary_archive.unlink()
            raise SystemExit(f"release contains macOS metadata: {', '.join(forbidden)}")

    temporary_archive.replace(archive)
    print(f"Created {archive.name}")


if __name__ == "__main__":
    main()
