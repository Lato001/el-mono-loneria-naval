// Generates `src/pages/Works/imageManifest.json` — a static { imageKey: { w, h } }
// map for the Works album images. Run manually whenever the album assets change:
//
//   node scripts/generate-image-manifest.mjs
//
// Requires `ffprobe` (ships with FFmpeg) on PATH. This is a dev-only step: the
// JSON is committed so Vite/TypeScript never need to read image bytes at build
// time (Vite 8 has no `?w&h` asset query). The Masonry uses these dimensions
// to pack columns without downloading the full-resolution images first.
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_ROOT = join(__dirname, "..", "src", "assets", "img", "works");
const OUT_FILE = join(__dirname, "..", "src", "pages", "Works", "imageManifest.json");

const EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

/** Strips the extension: "capota-01.webp" → "capota-01" (the stable imageKey). */
const toImageKey = (fileName) => fileName.replace(/\.[^.]+$/, "");

function readDimensions(filePath) {
  const out = execFileSync(
    "ffprobe",
    [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=s=x:p=0",
      filePath,
    ],
    { encoding: "utf8" },
  ).trim();
  const [w, h] = out.split("x").map(Number);
  return { w, h };
}

const manifest = {};
for (const category of readdirSync(ASSETS_ROOT)) {
  const dir = join(ASSETS_ROOT, category);
  for (const file of readdirSync(dir)) {
    const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
    if (!EXTENSIONS.has(ext)) continue;
    const key = toImageKey(file);
    manifest[key] = readDimensions(join(dir, file));
  }
}

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Wrote ${Object.keys(manifest).length} entries to ${relative(process.cwd(), OUT_FILE)}`,
);
