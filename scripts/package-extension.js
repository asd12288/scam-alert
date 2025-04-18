/**
 * Script to package the Chrome extension for distribution
 * Creates a zip file of the built extension in public/extension
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// First, ensure the built extension exists
const extensionDir = path.resolve(__dirname, '../public/extension');
if (!fs.existsSync(extensionDir)) {
  console.error('❌ Error: Extension not built. Run "npm run build:ext" first.');
  process.exit(1);
}

// Create output directory if it doesn't exist
const outputDir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read version from manifest.json
const manifestPath = path.resolve(extensionDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;

// Create a file to stream archive data to
const outputPath = path.resolve(outputDir, `scam-protector-v${version}.zip`);
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`✅ Extension packaged successfully: ${outputPath}`);
  console.log(`   Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
});

// Handle warnings and errors
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('⚠️ Warning:', err);
  } else {
    console.error('❌ Error during packaging:', err);
    process.exit(1);
  }
});

archive.on('error', function(err) {
  console.error('❌ Error during packaging:', err);
  process.exit(1);
});

// Pipe archive data to the file
archive.pipe(output);

// Add the extension directory contents to the archive
archive.directory(extensionDir, false);

// Finalize the archive
archive.finalize();