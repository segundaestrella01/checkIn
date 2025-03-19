import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(process.cwd(), 'public', 'icons');

// Ensure the icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create a simple colored square with text as a placeholder
async function generateIcon(size: number) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#4a90e2"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${size/4}px" fill="white" text-anchor="middle" dy=".3em">MC</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(iconDir, `icon-${size}x${size}.png`));
}

async function generateAllIcons() {
  for (const size of sizes) {
    await generateIcon(size);
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateAllIcons().catch(console.error);