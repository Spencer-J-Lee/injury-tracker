export type PainTone = "slate" | "green" | "amber" | "red";

export function painTone(painLevel: number | undefined): PainTone {
  if (painLevel === undefined) return "slate";
  if (painLevel <= 3) return "green";
  if (painLevel <= 6) return "amber";
  return "red";
}

export function painLabel(painLevel: number | undefined): string {
  if (painLevel === undefined) return "Not rated";
  if (painLevel === 0) return "None";
  if (painLevel <= 3) return "Mild";
  if (painLevel <= 6) return "Moderate";
  if (painLevel <= 9) return "Severe";
  return "Extreme";
}

export function freqTone(painFrequency: number | undefined): PainTone {
  if (painFrequency === undefined) return "slate";
  if (painFrequency <= 33) return "green";
  if (painFrequency <= 66) return "amber";
  return "red";
}
