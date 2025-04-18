/**
 * Simple script to generate placeholder icons for the Scam-Protector extension
 */
const fs = require('fs');
const path = require('path');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../extension/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to create a simple SVG icon with text
function createIconSVG(size, text) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#E34C26" />
    <text x="50%" y="50%" font-family="Arial" font-size="${size/3}" 
      text-anchor="middle" dominant-baseline="middle" fill="white">
      ${text}
    </text>
  </svg>`;
}

// Generate icons of different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const filePath = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(filePath, createIconSVG(size, 'SP'));
  console.log(`Created icon: ${filePath}`);
});

console.log('Icon generation complete!');