export async function fetchScreenshot(domain: string, origin: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${origin}/api/domain-analysis/screenshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain })
    });

    const data = await res.json();
    if (data.success && data.screenshot) {
      return data.screenshot as string;
    }
  } catch (error) {
    console.error("Error fetching screenshot:", error);
  }
  return undefined;
}
