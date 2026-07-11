export function formatInjuryName(injury: {
  bodyPart: string;
  injuryType: string;
}): string {
  if (!injury.injuryType) return injury.bodyPart;
  return `${injury.bodyPart}: ${injury.injuryType}`;
}
