declare module "safe-browse-url-lookup" {
  interface SafeBrowseOptions {
    apiKey: string;
    clientId?: string;
    clientVersion?: string;
  }

  interface SafeBrowseLookup {
    checkSingle: (url: string) => Promise<boolean>;
    checkMulti: (urls: string[]) => Promise<Record<string, boolean>>;
  }

  function safeBrowseLookup(options: SafeBrowseOptions): SafeBrowseLookup;
  export default safeBrowseLookup;
}
