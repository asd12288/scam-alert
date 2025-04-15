import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

interface ScreenshotOptions {
  width?: number;
  height?: number;
  timeout?: number;
  fullPage?: boolean;
  quality?: number;
}

/**
 * Capture a screenshot of a website
 * @param url The URL to capture
 * @param options Screenshot options
 * @returns The screenshot as a base64 encoded string or null if an error occurs
 */
export async function captureScreenshot(
  url: string,
  options: ScreenshotOptions = {}
): Promise<string | null> {
  const {
    width = 1280,
    height = 800,
    timeout = 10000,
    fullPage = false,
    quality = 80,
  } = options;

  // Ensure the URL has a protocol
  const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;

  let browser;
  try {
    // Set up browser options
    const browserOptions = {
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
      ],
      headless: "new",
      defaultViewport: { width, height },
    };

    // Launch browser
    browser = await puppeteer.launch(browserOptions);
    const page = await browser.newPage();

    // Set a reasonable timeout to prevent hanging
    await page.setDefaultNavigationTimeout(timeout);

    // Block some resource types to speed up loading
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      // Block unnecessary resources to speed up loading
      if (["media", "font", "websocket", "manifest"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Navigate to the URL
    await page.goto(urlWithProtocol, {
      waitUntil: "domcontentloaded",
      timeout,
    });

    // Wait a bit for content to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Take the screenshot
    const screenshot = await page.screenshot({
      type: "jpeg",
      quality,
      fullPage,
      encoding: "base64",
    });

    return screenshot.toString();
  } catch (error) {
    console.error(`Error capturing screenshot for ${url}:`, error);
    return null;
  } finally {
    // Always close the browser
    if (browser) {
      await browser.close();
    }
  }
}
