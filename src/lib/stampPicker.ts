const KEY = "stampPicker:stamps";
const LAST_USED_KEY = "stampPicker:lastUsed";

export const DEFAULT_STAMPS = ["→", "°", "±", "≈"];

export function getStamps(): string[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_STAMPS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === "string")) {
      return parsed;
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_STAMPS;
}

export function setStamps(stamps: string[]) {
  localStorage.setItem(KEY, JSON.stringify(stamps));
}

export function getLastUsedStamp(): string | null {
  return localStorage.getItem(LAST_USED_KEY);
}

export function setLastUsedStamp(stamp: string) {
  localStorage.setItem(LAST_USED_KEY, stamp);
}
