/**
 * Copy extension assets to the public directory
 * This script is used to replace shell commands that don't work on Windows
 */
const fs = require("fs");
const path = require("path");

// Ensure the output directory exists
const publicExtDir = path.resolve(__dirname, "../public/extension");
const publicExtIconsDir = path.resolve(__dirname, "../public/extension/icons");

if (!fs.existsSync(publicExtDir)) {
  fs.mkdirSync(publicExtDir, { recursive: true });
}

if (!fs.existsSync(publicExtIconsDir)) {
  fs.mkdirSync(publicExtIconsDir, { recursive: true });
}

// Copy manifest.json
fs.copyFileSync(
  path.resolve(__dirname, "../extension/manifest.json"),
  path.resolve(__dirname, "../public/extension/manifest.json")
);
console.log("✅ Copied manifest.json");

// Copy styles.css
fs.copyFileSync(
  path.resolve(__dirname, "../extension/styles.css"),
  path.resolve(__dirname, "../public/extension/styles.css")
);
console.log("✅ Copied styles.css");

// Copy icons
const iconDir = path.resolve(__dirname, "../extension/icons");
if (fs.existsSync(iconDir)) {
  const icons = fs.readdirSync(iconDir);
  icons.forEach((icon) => {
    const srcPath = path.join(iconDir, icon);
    const destPath = path.join(publicExtIconsDir, icon);
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied icon: ${icon}`);
    }
  });
}

console.log("✅ All extension assets copied successfully");
