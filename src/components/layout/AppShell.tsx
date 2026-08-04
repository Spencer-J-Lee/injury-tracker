import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useLogModal } from "@/context/useLogModal";
import { useJournalModal } from "@/context/useJournalModal";
import { LogEntryModal } from "@/components/logs/LogEntryModal";
import { TodayJournalModal } from "@/components/journal/TodayJournalModal";
import { StampPicker } from "@/components/stamps/StampPicker";
import { BackupBanner } from "./BackupBanner";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useAnyModalOpen } from "@/lib/modalStore";
import { Kbd } from "@/components/ui/Kbd";
import {
  dashboardShortcutLabel,
  journalShortcutLabel,
  strengtheningShortcutLabel,
  habitsShortcutLabel,
  settingsShortcutLabel,
  journalQuickEditShortcutLabel,
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
  const { openJournalModal } = useJournalModal();
  const anyModalOpen = useAnyModalOpen();

  useKeyboardShortcut(
    dashboardShortcutLabel,
    () => navigate("/"),
    !anyModalOpen,
  );
  useKeyboardShortcut(
    habitsShortcutLabel,
    () => navigate("/habits"),
    !anyModalOpen,
  );
  useKeyboardShortcut(
    journalShortcutLabel,
    () => navigate("/journal"),
    !anyModalOpen,
  );
  useKeyboardShortcut(
    strengtheningShortcutLabel,
    () => navigate("/strengthening"),
    !anyModalOpen,
  );
  useKeyboardShortcut(
    settingsShortcutLabel,
    () => navigate("/settings"),
    !anyModalOpen,
  );
  useKeyboardShortcut(
    journalQuickEditShortcutLabel.toLowerCase(),
    () => openJournalModal(),
    !anyModalOpen,
  );

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
              {navLinkSidebar("/", "Injuries", dashboardShortcutLabel)}
              {navLinkSidebar("/habits", "Habits", habitsShortcutLabel)}
              {navLinkSidebar(
                "/strengthening",
                "Strengthening",
                strengtheningShortcutLabel,
              )}
              {navLinkSidebar("/journal", "Journal", journalShortcutLabel)}
              {navLinkSidebar("/settings", "Settings", settingsShortcutLabel)}
            </nav>
          </aside>

          <div className="bg-canvas">
            <header className="border-subtle bg-canvas/90 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur lg:hidden">
              <Link to="/" className="font-heading text-ink font-semibold">
                Rehab Tracker
              </Link>
              <nav className="flex gap-1">
                {navLinkMobile("/", "Injuries")}
                {navLinkMobile("/habits", "Habits")}
                {navLinkMobile("/strengthening", "Strengthening")}
                {navLinkMobile("/journal", "Journal")}
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
        onClick={() => openJournalModal()}
        title={`Today's journal entry (${journalQuickEditShortcutLabel})`}
        className="bg-surface-raised text-ink hover:bg-canvas-sidebar border-subtle fixed right-7 bottom-27 flex h-14 w-14 items-center justify-center rounded-full border text-xl shadow-lg lg:right-8 lg:bottom-8"
      >
        <FontAwesomeIcon icon={faPen} />
      </button>

      <button
        onClick={() => openLogModal()}
        className="bg-accent text-accent-on hover:bg-accent-hover fixed right-7 bottom-7 flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg lg:hidden"
      >
        +
      </button>

      <LogEntryModal />
      <TodayJournalModal />
      <StampPicker />
    </div>
  );
}
