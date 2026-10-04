import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUB = "public";
const OUT = path.join(PUB, "showcase");

for (const d of ["cards", "wide", "tall", "panels", "plates", "trail"]) {
  fs.mkdirSync(path.join(OUT, d), { recursive: true });
}

const jpg = (q = 78) => ({ quality: q, mozjpeg: true, chromaSubsampling: "4:4:4" });

/** Crop a region from the top of a tall screenshot at a target aspect. */
async function topCrop(src, dest, w, h, { offsetRatio = 0 } = {}) {
  const img = sharp(src);
  const meta = await img.metadata();
  const aspect = w / h;
  let cw = meta.width;
  let ch = Math.round(cw / aspect);
  if (ch > meta.height) {
    ch = meta.height;
    cw = Math.round(ch * aspect);
  }
  const top = Math.min(
    Math.round(meta.height * offsetRatio),
    Math.max(0, meta.height - ch),
  );
  const left = Math.max(0, Math.round((meta.width - cw) / 2));

  await img
    .extract({ left, top, width: cw, height: ch })
    .resize(w, h, { fit: "cover", kernel: "lanczos3" })
    .jpeg(jpg(78))
    .toFile(dest);
}

async function fitTo(src, dest, w, h, q = 78) {
  await sharp(src)
    .resize(w, h, { fit: "cover", position: "top", kernel: "lanczos3" })
    .jpeg(jpg(q))
    .toFile(dest);
}

async function iconTo(src, dest, max) {
  await sharp(src)
    .resize(max, max, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 5 })
    .toFile(dest);
}

// ── 6 portrait cards for the drag deck (3:4) ──────────────────────────────
const cardSources = [
  ["swipeCards/website1.jpeg", 0.02],
  ["swipeCards/website3.jpeg", 0.02],
  ["swipeCards/websiteTwo1.png", 0.02],
  ["swipeCards/website4.jpeg", 0.02],
  ["swipeCards/websiteThree1.jpeg", 0.02],
  ["swipeCards/website2.jpeg", 0.02],
];
let i = 1;
for (const [src, off] of cardSources) {
  const dest = path.join(OUT, "cards", `0${i}.jpg`);
  await topCrop(path.join(PUB, src), dest, 840, 1120, { offsetRatio: off });
  i++;
}

// ── 5 landscape frames for the carousel (16:10) ───────────────────────────
const wideSources = [
  ["swipeCards/websiteThree2.jpeg", 0.0],
  ["swipeCards/websiteTwo2.png", 0.0],
  ["swipeCards/website1.jpeg", 0.0],
  ["MarqueImages/web2.png", 0.0],
  ["MarqueImages/web8.png", 0.0],
];
i = 1;
for (const [src, off] of wideSources) {
  await topCrop(
    path.join(PUB, src),
    path.join(OUT, "wide", `0${i}.jpg`),
    1440, 900, { offsetRatio: off },
  );
  i++;
}

// ── 3 tall frames for the parallax gallery (2:3) ──────────────────────────
i = 1;
for (const src of ["hiddenImages/one.jpg", "hiddenImages/two.jpg", "hiddenImages/three.jpg"]) {
  await topCrop(path.join(PUB, src), path.join(OUT, "tall", `0${i}.jpg`), 640, 960);
  i++;
}

// ── 4 portrait panels for the scroll sequence ─────────────────────────────
i = 1;
for (const src of ["MarqueImages/web1.png", "MarqueImages/web4.png", "MarqueImages/web5.png", "MarqueImages/web9.png"]) {
  await fitTo(path.join(PUB, src), path.join(OUT, "panels", `0${i}.jpg`), 560, 1120, 80);
  i++;
}

// ── 10 marquee plates ─────────────────────────────────────────────────────
const plateSources = ["web1","web3","web10","web2","web4","web8","web5","web9","web7","web11"];
i = 1;
for (const name of plateSources) {
  const n = String(i).padStart(2, "0");
  await fitTo(path.join(PUB, "MarqueImages", `${name}.png`), path.join(OUT, "plates", `${n}.jpg`), 640, 400, 76);
  i++;
}

// ── 12 pointer-trail icons ────────────────────────────────────────────────
const trail = fs.readdirSync(path.join(PUB, "imageTrail")).filter((f) => f.endsWith(".png"));
for (const f of trail) {
  await iconTo(path.join(PUB, "imageTrail", f), path.join(OUT, "trail", f.replace(".png", ".webp")), 360);
}

// ── Report ────────────────────────────────────────────────────────────────
function dirSize(dir) {
  let total = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    total += e.isDirectory() ? dirSize(fp) : fs.statSync(fp).size;
  }
  return total;
}
console.log("showcase total:", (dirSize(OUT) / 1024 / 1024).toFixed(2), "MB");
for (const d of ["cards", "wide", "tall", "panels", "plates", "trail"]) {
  console.log(" ", d.padEnd(8), (dirSize(path.join(OUT, d)) / 1024).toFixed(0) + "KB");
}
