import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const INTRO_SCIENCE =
  "Based on the Silbernagel pain-monitoring model, originally developed for Achilles tendinopathy and now applied broadly to tendon/overuse rehab. Studies (Silbernagel et al., 2007, American Journal of Sports Medicine) found that patients allowed to exercise through moderate pain (up to ~5/10) had equal or better long-term outcomes than those told to stay pain-free — likely because continued loading stimulates tissue adaptation (collagen remodeling), while total rest leads to deconditioning and delayed return to function.";

const CHECKS: { title: string; text: string; science?: string }[] = [
  {
    title: "During the set",
    text: "Mild symptoms are okay, but should not climb rep after rep. If it's escalating, stop.",
    science:
      'Progressively worsening pain during a task suggests the tissue is being pushed past its momentary load tolerance rather than just "waking up." This is a common clinical heuristic to prevent acute overload, though it\'s based more on pattern-recognition in practice than a single controlled trial.',
  },
  {
    title: "5-10 minutes after",
    text: "Symptoms should settle down toward your pre-exercise baseline. If it's still elevated well past that, the session was too much.",
  },
  {
    title: "Next morning (the most important)",
    text: "Symptoms and stiffness the next morning should be no worse than your baseline. If you wake up worse, scale back load/volume next session. This delayed response is often the best signal as in-the-moment pain can be misleading.",
    science:
      "This comes directly from the Silbernagel protocol's follow-up rule: pain/stiffness should return to baseline by the next morning. Delayed-onset soreness and inflammatory response peak 24-48 hours post-load, so next-day status is a much better proxy for whether the dose was appropriate than how something felt in the moment — a session can feel fine and still exceed tissue capacity, especially with connective tissue (tendon, fascia), which remodels more slowly and has lower metabolic/blood turnover than muscle.",
  },
];

const PAIN_SCALE: { range: string; text: string }[] = [
  { range: "0-2", text: "Barely noticeable" },
  {
    range: "3-5 (target zone)",
    text: "Noticeable ache/pull, but form holds and you could talk through it",
  },
  {
    range: "6-7",
    text: "Sharp/distracting, changes your form — stop the exercise",
  },
  { range: "8-10", text: "Severe — should never be reached" },
];

const RULES: { title: string; text: string; science?: string }[] = [
  {
    title: "Numbness or tingling = stop immediately",
    text: "Nerves have separate rules from muscles. Never push through nerve symptoms.",
    science:
      "Nerve tissue doesn't follow the same \"safe to load through discomfort\" logic as muscle/tendon. Compressive or tensile nerve irritation (e.g., ulnar nerve entrapment) can worsen with repeated provocation, and unlike muscle soreness, nerve symptoms don't reliably self-limit — they're a marker of mechanical irritation, not just fatigue. Standard neurodynamic and orthopedic guidelines treat any neural symptom as an immediate stop signal.",
  },
  {
    title: 'Always warm up first, even for "easy" sessions',
    text: "It's important to be extra careful since your body's tolerance for load is extremely low. A proper warm-up can be the difference between a productive set and a flare up.",
  },
  {
    title: "Progress slowly: 5-10% per week",
    text: "Change only one variable at a time (load, reps, or sets). If the next-day check passes for a couple sessions in a row, you're clear to progress. If not, dial it back. I know it's tempting to progress faster because you've already endured the pain for so long, but remember that patience and steady progress is what will get you out of this. Trying to rush through has proven time and time again to only dig you deeper into the hole.",
    science:
      "Standard resistance-training and tendon-rehab literature (e.g., Kongsgaard et al. on tendon loading, and general strength & conditioning guidelines) recommends conservative, single-variable increases — usually 5-10% per week — to allow tissue (especially tendon and connective tissue, which adapt slower than muscle) to keep pace with load demands. Changing multiple variables at once (load + volume + frequency) makes it hard to isolate what caused a flare.",
  },
  {
    title: "Rest 48 hours between sessions for the same muscle group",
    text: "Unless your symptom response says otherwise, it's best to be cautious and give your muscles ample recovery time in order to prevent overworking them and losing progress.",
    science:
      "Muscle protein synthesis and connective tissue remodeling take roughly 24-48 hours to normalize after a loading session, particularly in overuse/deconditioned tissue. This window is standard in strength training research and tendon-rehab protocols as a baseline recovery period, adjusted up or down based on individual symptom response.",
  },
  {
    title: "Log it: Exercise, load, in-session symptoms, next-day symptoms",
    text: "Watch the next-day reports very closely as that's your best signal.",
    science:
      "Not evidence-based per se, but a documented best practice in rehab adherence literature — self-monitoring improves both compliance and a person's ability to detect their own patterns compared to relying on memory.",
  },
];

function ScienceNote({ text }: { text: string }) {
  return (
    <p className="text-accent-soft-text border-accent mt-1.5 border-l-3 pl-3 italic">
      {text}
    </p>
  );
}

function GuidelineItem({
  variant,
  title,
  text,
  science,
  showScience,
}: {
  variant: "inline" | "heading";
  title: string;
  text: string;
  science?: string;
  showScience: boolean;
}) {
  return (
    <div className={variant === "heading" ? "mt-5" : undefined}>
      {variant === "heading" ? (
        <>
          <p className="font-heading text-ink mb-1 text-lg font-medium">
            {title}
          </p>
          <p className="text-ink-muted">{text}</p>
        </>
      ) : (
        <p>
          <span className="text-ink font-medium">{title}: </span>
          <span className="text-ink-muted">{text}</span>
        </p>
      )}
      {showScience && science && <ScienceNote text={science} />}
    </div>
  );
}

export function StrengtheningGuidelines() {
  const [showScience, setShowScience] = useState(false);

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="font-heading text-ink text-2xl font-semibold">
          Strengthening Guidelines for Rehabilitation
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowScience((prev) => !prev)}
        >
          {showScience ? "Hide scientific basis" : "Show scientific basis"}
        </Button>
      </div>

      <div>
        <p className="font-heading text-ink mb-1 text-lg font-medium">
          Pain is okay, escalating pain is not
        </p>
        <p className="text-ink-muted">
          Mild-to-moderate symptoms (roughly 3-5/10) during exercise are normal
          and fine. The goal isn't zero pain, it's pain that doesn't get worse.
        </p>
        {showScience && <ScienceNote text={INTRO_SCIENCE} />}
        <div className="pl-8">
          <div className="mt-3">
            <p className="font-heading text-ink mb-1 text-lg font-medium">
              Pain scale
            </p>
            <div className="mt-1 space-y-1 pl-8">
              {PAIN_SCALE.map((level) => (
                <p key={level.range}>
                  <span className="text-ink font-medium">{level.range}: </span>
                  <span className="text-ink-muted">{level.text}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="font-heading text-ink mb-1 text-lg font-medium">
              Check three times
            </p>
            <div className="mt-1 space-y-2 pl-8">
              {CHECKS.map((check) => (
                <GuidelineItem
                  key={check.title}
                  variant="inline"
                  showScience={showScience}
                  {...check}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {RULES.map((rule) => (
        <GuidelineItem
          key={rule.title}
          variant="heading"
          showScience={showScience}
          {...rule}
        />
      ))}
    </Card>
  );
}
