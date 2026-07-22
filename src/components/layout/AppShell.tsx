import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useLogModal } from "@/context/useLogModal";
import { LogEntryModal } from "@/components/logs/LogEntryModal";
import { StampPicker } from "@/components/stamps/StampPicker";
import { BackupBanner } from "./BackupBanner";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useAnyModalOpen } from "@/lib/modalStore";
import { Kbd } from "@/components/ui/Kbd";
import {
  dashboardShortcutLabel,
  journalShortcutLabel,
  strengtheningShortcutLabel,
} from "@/lib/shortcuts";
import { UnsavedChangesBlockerProvider } from "@/context/UnsavedChangesBlockerProvider";

export function AppShell() {
  return (
    <UnsavedChangesBlockerProvider>
      <AppShellContent />
    </UnsavedChangesBlockerProvider>
  );
}

function AppShellContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openLogModal } = useLogModal();
  const anyModalOpen = useAnyModalOpen();

  useKeyboardShortcut("d", () => navigate("/"), !anyModalOpen);
  useKeyboardShortcut("j", () => navigate("/journal"), !anyModalOpen);
  useKeyboardShortcut("s", () => navigate("/strengthening"), !anyModalOpen);

  const navLinkMobile = (to: string, label: string) => (
    <Link
      to={to}
      className={clsx(
        "rounded-xl px-4 py-2 text-lg",
        location.pathname === to
          ? "bg-accent-soft text-accent-soft-text font-semibold"
          : "text-ink-muted font-medium",
      )}
    >
      {label}
    </Link>
  );

  const navLinkSidebar = (to: string, label: string, shortcut?: string) => (
    <Link
      to={to}
      className={clsx(
        "flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-lg",
        location.pathname === to
          ? "bg-accent-soft text-accent-soft-text font-semibold"
          : "text-ink-muted hover:text-ink-secondary font-medium",
      )}
    >
      {label}
      {shortcut && <Kbd>{shortcut}</Kbd>}
    </Link>
  );

  return (
    <div className="bg-canvas-page min-h-screen">
      <div className="mx-auto max-w-[1750px] lg:p-8">
        <div className="bg-canvas lg:border-subtle lg:grid lg:grid-cols-[252px_1fr] lg:overflow-hidden lg:rounded-3xl lg:border lg:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
          <aside className="border-subtle bg-canvas-sidebar hidden border-r lg:flex lg:flex-col lg:gap-6 lg:p-6">
            <Link
              to="/"
              className="font-heading text-ink text-2xl font-semibold"
            >
              Rehab Tracker
            </Link>
            <nav className="flex flex-col gap-1">
              {navLinkSidebar("/", "Dashboard", dashboardShortcutLabel)}
              {navLinkSidebar("/journal", "Journal", journalShortcutLabel)}
              {navLinkSidebar(
                "/strengthening",
                "Strengthening",
                strengtheningShortcutLabel,
              )}
              {navLinkSidebar("/settings", "Settings")}
            </nav>
          </aside>

          <div className="bg-canvas">
            <header className="border-subtle bg-canvas/90 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur lg:hidden">
              <Link to="/" className="font-heading text-ink font-semibold">
                Rehab Tracker
              </Link>
              <nav className="flex gap-1">
                {navLinkMobile("/", "Dashboard")}
                {navLinkMobile("/journal", "Journal")}
                {navLinkMobile("/strengthening", "Strengthening")}
                {navLinkMobile("/settings", "Settings")}
              </nav>
            </header>

            <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-7 lg:max-w-none lg:p-6">
              <BackupBanner />
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <button
        onClick={() => openLogModal()}
        className="bg-accent text-accent-on hover:bg-accent-hover fixed right-7 bottom-7 flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg lg:hidden"
      >
        +
      </button>

      <LogEntryModal />
      <StampPicker />
    </div>
  );
}
