# Scam-Protector Chrome Extension

A Chrome extension that automatically scans links on web pages and warns users about potentially risky websites.

## Features

- Automatically scans all links on webpages
- Fetches trust scores from scam-protector.com API
- Visually highlights risky links (score < 40)
- Displays warning tooltips on hover
- Works with dynamically loaded content
- Efficient caching to reduce API calls
- Privacy-focused (only hostnames are sent, not full URLs)

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build:ext
```

This will:
- Bundle the TypeScript files with esbuild
- Copy all necessary assets to the `public/extension` directory

### Loading in Chrome

1. Build the extension using `npm run build:ext`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `public/extension` directory
5. The extension should now be installed and active

### Development Workflow

1. Make changes to the source files in the `extension` directory
2. Run `npm run build:ext` to rebuild
3. In Chrome's extensions page, click the refresh icon on the extension card
4. Test your changes

## API Integration

The extension communicates with the scam-protector.com API, which requires:

- POST to `/api/bulk-score` 
- Request body: `{ "hosts": ["example.com", "another-domain.com"] }`
- Response: `{ "example.com": 85, "another-domain.com": 30 }`

## Privacy Considerations

- Only domain names are sent to the API, not full URLs
- Local caching reduces the number of API calls
- No user data is collected or stored

## Distribution

To prepare the extension for Chrome Web Store submission:

1. Update the version in `manifest.json`
2. Run `npm run build:ext`
3. Zip the contents of the `public/extension` directory
4. Upload to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)