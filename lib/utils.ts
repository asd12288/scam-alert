import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Domain check rate limiting for non-logged users
interface DomainCheck {
  timestamp: number;
  domain: string;
}

export const MAX_ANONYMOUS_CHECKS = 5;
export const CHECK_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function canCheckDomain(): {
  allowed: boolean;
  remaining: number;
  nextResetTime: number | null;
} {
  // For users who are logged in, always allow
  if (typeof window === "undefined") {
    return {
      allowed: true,
      remaining: MAX_ANONYMOUS_CHECKS,
      nextResetTime: null,
    };
  }

  try {
    // Get existing checks from localStorage
    const checksJson = localStorage.getItem("domainChecks");
    const checks: DomainCheck[] = checksJson ? JSON.parse(checksJson) : [];

    // Get current time
    const now = Date.now();

    // Filter out checks older than 24 hours
    const recentChecks = checks.filter(
      (check) => now - check.timestamp < CHECK_PERIOD_MS
    );

    // If there are any checks, find the earliest one to calculate reset time
    let nextResetTime: number | null = null;
    if (recentChecks.length > 0) {
      const earliestCheck = recentChecks.reduce(
        (earliest, current) =>
          current.timestamp < earliest.timestamp ? current : earliest,
        recentChecks[0]
      );
      nextResetTime = earliestCheck.timestamp + CHECK_PERIOD_MS;
    }

    // Check if we're under the limit
    const remaining = MAX_ANONYMOUS_CHECKS - recentChecks.length;
    const allowed = remaining > 0;

    return { allowed, remaining, nextResetTime };
  } catch (error) {
    console.error("Error checking domain rate limit:", error);
    // If there's an error reading from localStorage, we'll allow the check
    return {
      allowed: true,
      remaining: MAX_ANONYMOUS_CHECKS,
      nextResetTime: null,
    };
  }
}

export function recordDomainCheck(domain: string): void {
  if (typeof window === "undefined") return;

  try {
    // Get existing checks
    const checksJson = localStorage.getItem("domainChecks");
    const checks: DomainCheck[] = checksJson ? JSON.parse(checksJson) : [];

    // Add the new check
    const now = Date.now();
    checks.push({ timestamp: now, domain });

    // Filter out checks older than 24 hours
    const recentChecks = checks.filter(
      (check) => now - check.timestamp < CHECK_PERIOD_MS
    );

    // Save back to localStorage
    localStorage.setItem("domainChecks", JSON.stringify(recentChecks));
  } catch (error) {
    console.error("Error recording domain check:", error);
    // If there's an error with localStorage, we'll still let this check pass
  }
}
