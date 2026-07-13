import type { Injury } from "@/types/models";

interface InjuryTitleProps {
  injury: Pick<Injury, "bodyPart" | "injuryType" | "locationDetail">;
}

export function InjuryTitle({ injury }: InjuryTitleProps) {
  return (
    <>
      {injury.bodyPart}
      {injury.locationDetail && (
        <span className="text-ink-muted font-normal">
          {" "}
          ({injury.locationDetail})
        </span>
      )}
      {injury.injuryType && (
        <span className="text-ink-muted font-normal">
          : {injury.injuryType}
        </span>
      )}
    </>
  );
}
