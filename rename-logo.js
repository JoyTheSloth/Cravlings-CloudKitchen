const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

console.log('Searching for uploaded logo file in public directory...');

if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  const logoFile = files.find(file => file.startsWith('ChatGPT Image') && file.endsWith('.png'));

  if (logoFile) {
    const srcPath = path.join(publicDir, logoFile);
    const destPath = path.join(publicDir, 'logo.png');
    
    fs.renameSync(srcPath, destPath);
    console.log(`Successfully renamed "${logoFile}" to "logo.png"!`);
  } else {
    console.log('No "ChatGPT Image" PNG file found in the public folder. Checking if "logo.png" already exists...');
    if (fs.existsSync(path.join(publicDir, 'logo.png'))) {
      console.log('"logo.png" already exists in public/ folder.');
    } else {
      console.log('No logo file found to rename.');
    }
  }
} else {
  console.log('public directory does not exist.');
}
