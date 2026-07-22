import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStamp } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  getLastUsedStamp,
  getStamps,
  setLastUsedStamp,
  setStamps as persistStamps,
} from "@/lib/stampPicker";
import clsx from "clsx";

export function StampPicker() {
  const [open, setOpen] = useState(false);
  const [stamps, setStampsState] = useState<string[]>(() => getStamps());
  const [newStamp, setNewStamp] = useState("");
  const [copiedStamp, setCopiedStamp] = useState<string | null>(null);
  const [lastUsedStamp, setLastUsedStampState] = useState<string | null>(() =>
    getLastUsedStamp(),
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => setOpen(false);

  useClickOutside([buttonRef, panelRef], close, open);
  useFormShortcuts({ onCancel: close, enabled: open });

  const updateStamps = (next: string[]) => {
    setStampsState(next);
    persistStamps(next);
  };

  const handleCopy = async (stamp: string) => {
    try {
      await navigator.clipboard.writeText(stamp);
    } catch {
      return;
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopiedStamp(stamp);
    copyTimeoutRef.current = setTimeout(() => setCopiedStamp(null), 1200);
    setLastUsedStampState(stamp);
    setLastUsedStamp(stamp);
  };

  const handleRemove = (stamp: string) => {
    updateStamps(stamps.filter((s) => s !== stamp));
  };

  const handleAdd = () => {
    const trimmed = newStamp.trim();
    if (!trimmed || stamps.includes(trimmed)) {
      setNewStamp("");
      return;
    }
    updateStamps([...stamps, trimmed]);
    setNewStamp("");
  };

  return (
    <>
      <div className="fixed bottom-5 left-5 z-60 flex">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Copy a stamp"
          title="Copy a stamp"
          className={clsx([
            "border-subtle bg-surface-raised text-ink hover:bg-surface flex h-10 w-10 items-center justify-center rounded-full border shadow-lg",
            lastUsedStamp && "rounded-r-none border-r-0",
          ])}
        >
          <FontAwesomeIcon icon={faStamp} />
        </button>

        {lastUsedStamp && (
          <button
            type="button"
            onClick={() => handleCopy(lastUsedStamp)}
            aria-label={`Copy ${lastUsedStamp}`}
            title={`Copy ${lastUsedStamp}`}
            className="border-subtle bg-surface-raised text-ink hover:bg-surface flex h-10 w-10 items-center justify-center rounded-r-full border text-xl shadow-lg"
          >
            {copiedStamp === lastUsedStamp ? (
              <FontAwesomeIcon
                icon={faCheck}
                className="text-pain-green"
              />
            ) : (
              lastUsedStamp
            )}
          </button>
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="border-subtle bg-surface-raised fixed bottom-18 left-5 z-60 w-[314px] rounded-2xl border p-4 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
          >
            <h2 className="font-heading text-ink mb-4 font-semibold">
              Stamps
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {stamps.map((stamp) => (
                <div key={stamp} className="relative">
                  <button
                    type="button"
                    onClick={() => handleCopy(stamp)}
                    aria-label={`Copy ${stamp}`}
                    title={`Copy ${stamp}`}
                    className="border-strong bg-control text-ink hover:bg-canvas flex h-12 w-12 items-center justify-center rounded-xl border text-xl"
                  >
                    {copiedStamp === stamp ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-pain-green"
                      />
                    ) : (
                      stamp
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(stamp)}
                    aria-label={`Remove ${stamp}`}
                    title={`Remove ${stamp}`}
                    className="text-ink-faint border border-subtle hover:text-pain-red bg-surface-raised absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs leading-none"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-3">
              <Input
                value={newStamp}
                onChange={(e) => setNewStamp(e.target.value)}
                placeholder="Add stamp"
                maxLength={8}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
