"""
Build a multi-resolution favicon.ico (16/32/48) from the isotipo PNG.

ICO container format (no PIL needed):
  - 6-byte header: reserved(2)=0, type(2)=1 (ICO), count(2)=N
  - N * 16-byte directory entries
  - N image data blobs (we use PNG-encoded payloads, which the Windows
    ICO format permits when the bit-depth field is 32).

Source: src/assets/logos/elmono/isotipo-elmono.png (transparent, 1667x1667).
ffmpeg scales it to 16/32/48 PNGs, this script concatenates them into .ico.
"""
import os
import struct
import subprocess
import sys
import tempfile

# Resolve paths relative to the project root (one level above src/).
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(PROJECT_ROOT, "src", "assets", "logos", "elmono", "isotipo-elmono.png")
OUT = os.path.join(PROJECT_ROOT, "public", "favicon.ico")
SIZES = [16, 32, 48]


def scale(size: int) -> bytes:
    """Run ffmpeg to scale the isotipo to NxN PNG, return the bytes."""
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
        tmp = f.name
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                SRC,
                "-vf",
                f"scale={size}:{size}:flags=lanczos",
                "-update",
                "1",
                tmp,
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        with open(tmp, "rb") as f:
            return f.read()
    finally:
        os.unlink(tmp)


def build_ico(blobs: list[tuple[int, bytes]]) -> bytes:
    """Pack (size, png_bytes) tuples into a single .ico container."""
    count = len(blobs)
    out = bytearray()
    out += struct.pack("<HHH", 0, 1, count)
    entries_start = len(out)
    for _ in range(count):
        out += b"\x00" * 16
    for i, (size, data) in enumerate(blobs):
        offset = len(out)
        entry = struct.pack(
            "<BBBBHHII",
            size if size < 256 else 0,
            size if size < 256 else 0,
            0,
            0,
            1,
            32,
            len(data),
            offset,
        )
        out[entries_start + i * 16 : entries_start + (i + 1) * 16] = entry
        out += data
    return bytes(out)


def main() -> int:
    if not os.path.exists(SRC):
        print(f"Source PNG not found: {SRC}", file=sys.stderr)
        return 1
    blobs = [(s, scale(s)) for s in SIZES]
    ico = build_ico(blobs)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "wb") as f:
        f.write(ico)
    total_payload = sum(len(b) for _, b in blobs)
    print(
        f"Wrote {OUT} ({len(ico)} bytes, payload {total_payload} bytes "
        f"across sizes {SIZES})"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())