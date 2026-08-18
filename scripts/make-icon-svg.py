"""
Regenerate public/icon.svg with the isotipo PNG embedded as base64,
plus a prominent TODO marker at the top of the file reminding future
maintainers that this is a fallback until a real vector trace is
produced.
"""
import base64
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(ROOT, "src", "assets", "logos", "elmono", "isotipo-elmono.png")
OUT = os.path.join(ROOT, "public", "icon.svg")


def main() -> int:
    if not os.path.exists(SRC):
        print(f"Source PNG not found: {SRC}")
        return 1
    with open(SRC, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")

    # XML comment so the TODO is visible to anyone opening the file in
    # any editor. Replace this file with the real vector trace when
    # available (e.g. produced with vtracer / potrace / Illustrator).
    todo = (
        " TODO: replace this file with a real vector trace of the isotipo.\n"
        " The current <image> embeds the PNG (1667x1667) as base64 to work\n"
        " as a fallback. A proper SVG vector would be ~5-10 KB instead of\n"
        " ~120 KB and would scale crisply down to 16x16 favicons.\n"
        " Generate via: vtracer --input src/assets/logos/elmono/isotipo-elmono.png\n"
        "                --output public/icon.svg --filter_speckle 4\n"
        " or hand-trace it in Figma / Illustrator / Inkscape.\n"
    )
    svg = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<!--{todo}-->\n'
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'xmlns:xlink="http://www.w3.org/1999/xlink" '
        'viewBox="0 0 1667 1667" width="1667" height="1667">\n'
        '  <title>El Mono - Loneria naval</title>\n'
        f'  <image width="1667" height="1667" '
        f'xlink:href="data:image/png;base64,{b64}"/>\n'
        '</svg>\n'
    )
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Wrote {OUT} ({len(svg.encode('utf-8'))} bytes)")
    return 0


if __name__ == "__main__":
    import sys

    sys.exit(main())