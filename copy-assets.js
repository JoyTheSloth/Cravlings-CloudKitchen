const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/joyde/.gemini/antigravity/brain/743951ea-2684-45d2-ac38-8bd90b1c17ea';
const destDir = path.join(__dirname, 'public');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Copying assets from brain cache...');

const files = fs.readdirSync(srcDir);
files.forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.png' || ext === '.img' || ext === '.jpg' || ext === '.jpeg') {
    const srcPath = path.join(srcDir, file);
    // Rename .img to .png if it is an image
    let destName = file;
    if (ext === '.img') {
      destName = file.replace(/\.img$/, '.png');
    }
    const destPath = path.join(destDir, destName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file} -> public/${destName}`);
  }
});

console.log('Asset copying complete!');
