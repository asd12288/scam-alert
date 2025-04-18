const fs = require("fs");
const path = require("path");
const https = require("https");

const FONT_DIRECTORY = path.join(__dirname, "../public/fonts");
const FONTS = [
  {
    name: "Inter-Regular.ttf",
    url: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf",
  },
  {
    name: "Inter-Bold.ttf",
    url: "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.ttf",
  },
];

// Create the font directory if it doesn't exist
if (!fs.existsSync(FONT_DIRECTORY)) {
  fs.mkdirSync(FONT_DIRECTORY, { recursive: true });
}

// Download each font
FONTS.forEach((font) => {
  const filePath = path.join(FONT_DIRECTORY, font.name);
  const file = fs.createWriteStream(filePath);

  console.log(`Downloading ${font.name}...`);

  https
    .get(font.url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Downloaded ${font.name} to ${filePath}`);
      });
    })
    .on("error", (err) => {
      fs.unlinkSync(filePath); // Delete the file on error
      console.error(`Error downloading ${font.name}:`, err.message);
    });
});
