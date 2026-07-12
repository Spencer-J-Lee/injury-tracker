import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStamp } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getSymbols, setSymbols as persistSymbols } from "@/lib/symbolPicker";

export function SymbolPicker() {
  const [open, setOpen] = useState(false);
  const [symbols, setSymbolsState] = useState<string[]>(() => getSymbols());
  const [newSymbol, setNewSymbol] = useState("");
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => setOpen(false);

  useClickOutside([buttonRef, panelRef], close, open);
  useFormShortcuts({ onCancel: close, enabled: open });

  const updateSymbols = (next: string[]) => {
    setSymbolsState(next);
    persistSymbols(next);
  };

  const handleCopy = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
    } catch {
      return;
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopiedSymbol(symbol);
    copyTimeoutRef.current = setTimeout(() => setCopiedSymbol(null), 1200);
  };

  const handleRemove = (symbol: string) => {
    updateSymbols(symbols.filter((s) => s !== symbol));
  };

  const handleAdd = () => {
    const trimmed = newSymbol.trim();
    if (!trimmed || symbols.includes(trimmed)) {
      setNewSymbol("");
      return;
    }
    updateSymbols([...symbols, trimmed]);
    setNewSymbol("");
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Copy a symbol"
        title="Copy a symbol"
        className="border-subtle bg-surface-raised text-ink hover:bg-surface fixed bottom-6 left-6 z-[60] flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-lg"
      >
        <FontAwesomeIcon icon={faStamp} />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="border-subtle bg-surface-raised fixed bottom-20 left-6 z-[60] w-[260px] rounded-[18px] border p-4 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
          >
            <h2 className="font-heading text-ink mb-3 text-sm font-semibold">
              Symbols
            </h2>

            <div className="flex flex-wrap gap-2">
              {symbols.map((symbol) => (
                <div key={symbol} className="relative">
                  <button
                    type="button"
                    onClick={() => handleCopy(symbol)}
                    aria-label={`Copy ${symbol}`}
                    title={`Copy ${symbol}`}
                    className="border-strong bg-control text-ink hover:bg-canvas flex h-10 w-10 items-center justify-center rounded-[10px] border text-lg"
                  >
                    {copiedSymbol === symbol ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-pain-green text-sm"
                      />
                    ) : (
                      symbol
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(symbol)}
                    aria-label={`Remove ${symbol}`}
                    title={`Remove ${symbol}`}
                    className="text-ink-faint hover:text-pain-red bg-surface-raised absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="Add symbol"
                maxLength={8}
                className="text-base"
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
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
