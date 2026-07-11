import type { Injury } from "@/types/models";

interface InjuryTitleProps {
  injury: Pick<Injury, "bodyPart" | "injuryType">;
}

export function InjuryTitle({ injury }: InjuryTitleProps) {
  return (
    <>
      {injury.bodyPart}
      {injury.injuryType && (
        <span className="text-ink-muted font-normal">
          : {injury.injuryType}
        </span>
      )}
    </>
  );
}
