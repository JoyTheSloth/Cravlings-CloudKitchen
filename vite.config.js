import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Auto-copy assets from Gemini cache to public directory
const srcDir = 'C:/Users/joyde/.gemini/antigravity/brain/743951ea-2684-45d2-ac38-8bd90b1c17ea';
const destDir = path.join(__dirname, 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  // Copy user-provided mascot assets from brain cache to public directory
  const assetsToCopy = [
    { src: 'cravling_mascot_1783943766600.png', dest: 'mascot.png' },
    // Chef blobby used in wizard, sidebar, home hero
    { src: 'media__1784005269916.png', dest: 'blobbyimg.png' },
    { src: 'media__1784005269916.png', dest: 'chef.png' },
    { src: 'media__1784005269916.png', dest: 'chef_hero.png' }
  ];

  assetsToCopy.forEach(asset => {
    const srcPath = path.join(srcDir, asset.src);
    const destPath = path.join(destDir, asset.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${asset.dest}`);
    }
  });
} catch (e) {
  console.error('Failed to auto-copy assets:', e);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
