export const FEEDBACK_PLATFORMS = [
  { slug: "web", name: "Web" },
  { slug: "mobile", name: "Mobile" },
  { slug: "desktop", name: "Desktop" },
] as const;

export const DEFAULT_PRODUCT_DESCRIPTIONS: Record<string, string> = {
  web: "Cloud-based collaboration hub for real-time task management, project roadmaps, and team workflows accessible directly in modern web browsers.",
  mobile: "Companion app for iOS and Android providing instant triage notifications, offline notes, voice capture, and on-the-go idea voting.",
  desktop: "High-performance native client for macOS and Windows with offline-first synchronization, global keyboard shortcuts, and deep developer tooling.",
};

export function defaultProductSummary(slug: string, name: string): string {
  const key = (slug || name).trim().toLowerCase();
  return DEFAULT_PRODUCT_DESCRIPTIONS[key] ?? "The team has not published a product summary yet.";
}

export function feedbackProductPlatforms(product: {
  slug: string; name: string; areas?: readonly { slug: string; name: string }[];
}): string[] {
  const normalise = (value: string) => value.trim().toLowerCase();
  const platforms = FEEDBACK_PLATFORMS.filter(platform => product.areas?.some(area =>
    normalise(area.slug) === platform.slug || normalise(area.name) === platform.slug,
  )).map(platform => platform.slug);
  // Existing projects called Web/Mobile/Desktop predate platform areas.
  if (platforms.length) return platforms;
  return FEEDBACK_PLATFORMS.filter(platform => normalise(product.slug) === platform.slug || normalise(product.name) === platform.slug).map(platform => platform.slug);
}

export function feedbackProductSummary(description: string, limit = 170): string {
  const plain = description.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "").replace(/[#*`_>|]/g, "").replace(/\s+/g, " ").trim();
  if (plain.length <= limit) return plain;
  const short = plain.slice(0, limit - 1).replace(/\s+\S*$/, "").trimEnd();
  return `${short}…`;
}
