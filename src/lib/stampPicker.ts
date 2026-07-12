const KEY = "stampPicker:stamps";

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
