/**
 * Script to refresh the extension with latest styles and prevent caching
 * This will copy the latest styles.css to the public/extension folder
 * and add a version timestamp to prevent browser caching
 */
const fs = require('fs');
const path = require('path');

// Define paths
const sourceStylePath = path.resolve(__dirname, '../extension/styles.css');
const publicExtensionDir = path.resolve(__dirname, '../public/extension');
const targetStylePath = path.resolve(publicExtensionDir, 'styles.css');
const manifestSourcePath = path.resolve(__dirname, '../extension/manifest.json');
const manifestTargetPath = path.resolve(publicExtensionDir, 'manifest.json');

// Ensure the public extension directory exists
if (!fs.existsSync(publicExtensionDir)) {
  fs.mkdirSync(publicExtensionDir, { recursive: true });
  console.log('📁 Created public extension directory');
}

// Function to add cache-busting comment to CSS
function addCacheBustingToCSS(cssContent) {
  const timestamp = new Date().toISOString();
  return `/* Version: ${timestamp} - Cache busting timestamp */\n${cssContent}`;
}

// Function to update version in manifest.json
function updateManifestVersion(manifestContent) {
  const manifest = JSON.parse(manifestContent);
  
  // Generate a new version based on date (YYYY.MM.DD.HHMM)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  // Create a version like 2025.04.18.1423
  manifest.version = `${year}.${month}.${day}.${hour}${minute}`;
  
  return JSON.stringify(manifest, null, 2);
}

// Copy and update the styles.css file
try {
  if (fs.existsSync(sourceStylePath)) {
    // Read the source CSS file
    const cssContent = fs.readFileSync(sourceStylePath, 'utf8');
    
    // Add cache-busting timestamp
    const updatedCssContent = addCacheBustingToCSS(cssContent);
    
    // Write the updated CSS file to the target path
    fs.writeFileSync(targetStylePath, updatedCssContent);
    console.log('✅ Copied and updated styles.css with cache-busting timestamp');
  } else {
    console.error('❌ Source styles.css not found at:', sourceStylePath);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error updating styles.css:', error);
  process.exit(1);
}

// Update the manifest.json version
try {
  if (fs.existsSync(manifestSourcePath)) {
    // Read the source manifest file
    const manifestContent = fs.readFileSync(manifestSourcePath, 'utf8');
    
    // Update the version in manifest
    const updatedManifestContent = updateManifestVersion(manifestContent);
    
    // Write the updated manifest to the target path
    fs.writeFileSync(manifestTargetPath, updatedManifestContent);
    console.log('✅ Updated manifest.json with new version');
    
    // Output the new version
    const newVersion = JSON.parse(updatedManifestContent).version;
    console.log(`🔖 New extension version: ${newVersion}`);
  } else {
    console.error('❌ Source manifest.json not found at:', manifestSourcePath);
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error updating manifest.json:', error);
  process.exit(1);
}

// Copy content.js if it exists
const sourceContentPath = path.resolve(__dirname, '../extension/content.js');
const targetContentPath = path.resolve(publicExtensionDir, 'content.js');

try {
  if (fs.existsSync(sourceContentPath)) {
    // Read the source content.js file
    const contentJsContent = fs.readFileSync(sourceContentPath, 'utf8');
    
    // Add a timestamp comment
    const timestamp = new Date().toISOString();
    const updatedContentJs = `// Last updated: ${timestamp}\n${contentJsContent}`;
    
    // Write the updated content.js to the target path
    fs.writeFileSync(targetContentPath, updatedContentJs);
    console.log('✅ Copied and updated content.js with timestamp');
  } else if (fs.existsSync(path.resolve(__dirname, '../extension/content.ts'))) {
    console.warn('⚠️ Found content.ts but not content.js - make sure to compile your TypeScript files');
  }
} catch (error) {
  console.error('❌ Error handling content.js:', error);
}

console.log('\n🚀 Extension refresh completed successfully!');
console.log('⚠️ Important: You need to reload the extension in your browser:');
console.log('   1. Go to chrome://extensions/');
console.log('   2. Find Scam-Protector');
console.log('   3. Click the reload button (circular arrow)');
console.log('   4. Refresh any open test pages\n');