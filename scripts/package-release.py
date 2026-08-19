#!/usr/bin/env python3

import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
ZIP_TIMESTAMP = (2020, 1, 1, 0, 0, 0)
EXTRA_FILES = ("package.json", "scripts/package-release.py", "scripts/verify-package.mjs")


def is_macos_metadata(path):
    return any(part in {".DS_Store", "__MACOSX"} or part.startswith("._") for part in path.parts)


def collect_files(package_json):
    files = {}
    entries = [*package_json.get("files", []), *EXTRA_FILES]

    for entry in entries:
        relative = Path(entry.rstrip("/"))
        source = ROOT / relative
        if not source.exists():
            raise FileNotFoundError(f"Missing release entry: {relative}")

        candidates = [source] if source.is_file() else source.rglob("*")
        for candidate in candidates:
            if not candidate.is_file():
                continue
            if candidate.is_symlink():
                raise RuntimeError(f"Release entry must not be a symlink: {candidate.relative_to(ROOT)}")
            archive_path = candidate.relative_to(ROOT)
            if not is_macos_metadata(archive_path):
                files[archive_path.as_posix()] = candidate

    return sorted(files.items())


def write_zip(path, files):
    with ZipFile(path, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for archive_path, source in files:
            info = ZipInfo(archive_path, ZIP_TIMESTAMP)
            info.compress_type = ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o644 << 16
            archive.writestr(info, source.read_bytes())


def validate_zip(path, expected_names):
    with ZipFile(path) as archive:
        names = archive.namelist()
        if names != expected_names:
            raise RuntimeError("Archive manifest does not match the filtered release files")
        if any(is_macos_metadata(Path(name)) for name in names):
            raise RuntimeError("Archive contains macOS metadata")
        corrupt = archive.testzip()
        if corrupt:
            raise RuntimeError(f"Archive CRC check failed: {corrupt}")

        with tempfile.TemporaryDirectory(prefix="kling-workbuddy-cn-verify-") as temporary:
            archive.extractall(temporary)
            node = shutil.which("node")
            if not node:
                raise RuntimeError("Node.js is required to validate the release archive")
            subprocess.run(
                [node, "scripts/verify-package.mjs"],
                cwd=temporary,
                check=True,
            )


def main():
    package_json = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    version = package_json["version"]
    files = collect_files(package_json)
    expected_names = [name for name, _ in files]

    DIST.mkdir(exist_ok=True)
    output = DIST / f"kling-workbuddy-cn-v{version}.zip"

    with tempfile.NamedTemporaryFile(prefix="kling-workbuddy-cn-", suffix=".zip", dir=DIST, delete=False) as temporary:
        temporary_path = Path(temporary.name)

    try:
        write_zip(temporary_path, files)
        validate_zip(temporary_path, expected_names)
        os.replace(temporary_path, output)
        output.chmod(0o644)
    finally:
        temporary_path.unlink(missing_ok=True)

    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    print(f"Created {output}")
    print(f"Files: {len(files)}")
    print(f"SHA-256: {digest}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Packaging failed: {error}", file=sys.stderr)
        sys.exit(1)
