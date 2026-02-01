import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const iconsDir = path.join(root, "public", "icons");
const svgPath = path.join(iconsDir, "icon.svg");

const sizes = [16, 48, 128];

for (const size of sizes) {
  const outPath = path.join(iconsDir, `icon${size}.png`);
  await sharp(svgPath).resize(size, size).png().toFile(outPath);
  console.log(`Wygenerowano: icon${size}.png`);
}
