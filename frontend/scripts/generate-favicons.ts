import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';

async function generateFavicons() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const inputPath = path.join(publicDir, 'favicon.ico');

    const inputBuffer = await fs.readFile(inputPath);

    await sharp(inputBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    await sharp(inputBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    await sharp(inputBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('Favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();