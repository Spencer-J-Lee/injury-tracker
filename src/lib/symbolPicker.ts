const KEY = "symbolPicker:symbols";

export const DEFAULT_SYMBOLS = ["→", "°", "±", "≈"];

export function getSymbols(): string[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_SYMBOLS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === "string")) {
      return parsed;
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_SYMBOLS;
}

export function setSymbols(symbols: string[]) {
  localStorage.setItem(KEY, JSON.stringify(symbols));
}
