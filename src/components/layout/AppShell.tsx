import { Link, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useLogModal } from "@/context/useLogModal";
import { getLastJournalPage } from "@/lib/journalPage";
import { LogEntryModal } from "@/components/logs/LogEntryModal";
import { StampPicker } from "@/components/stamps/StampPicker";

export function AppShell() {
  const location = useLocation();
  const { openLogModal } = useLogModal();

  const journalTo = () => {
    const page = getLastJournalPage();
    return page > 1 ? `/journal?page=${page}` : "/journal";
  };

  const navLinkMobile = (to: string, label: string) => (
    <Link
      to={to === "/journal" ? journalTo() : to}
      className={clsx(
        "rounded-[10px] px-3 py-1.5 text-sm",
        location.pathname === to
          ? "bg-accent-soft text-accent-soft-text font-semibold"
          : "text-ink-muted font-medium",
      )}
    >
      {label}
    </Link>
  );

  const navLinkSidebar = (to: string, label: string) => (
    <Link
      to={to === "/journal" ? journalTo() : to}
      className={clsx(
        "rounded-[10px] px-3 py-[9px] text-sm",
        location.pathname === to
          ? "bg-accent-soft text-accent-soft-text font-semibold"
          : "text-ink-muted hover:text-ink-secondary font-medium",
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="bg-canvas-page min-h-screen">
      <div className="mx-auto max-w-[1400px] lg:p-6">
        <div className="bg-canvas lg:border-subtle lg:grid lg:grid-cols-[220px_1fr] lg:overflow-hidden lg:rounded-[20px] lg:border lg:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
          <aside className="border-subtle bg-canvas-sidebar hidden border-r lg:flex lg:flex-col lg:gap-5 lg:p-6">
            <Link
              to="/"
              className="font-heading text-ink text-[19px] font-semibold"
            >
              Rehab Tracker
            </Link>
            <nav className="flex flex-col gap-1">
              {navLinkSidebar("/", "Dashboard")}
              {navLinkSidebar("/journal", "Journal")}
              {navLinkSidebar("/settings", "Settings")}
            </nav>
          </aside>

          <div className="bg-canvas">
            <header className="border-subtle bg-canvas/90 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 backdrop-blur lg:hidden">
              <Link to="/" className="font-heading text-ink font-semibold">
                Rehab Tracker
              </Link>
              <nav className="flex gap-1">
                {navLinkMobile("/", "Dashboard")}
                {navLinkMobile("/journal", "Journal")}
                {navLinkMobile("/settings", "Settings")}
              </nav>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:max-w-none lg:p-6">
              {/* <BackupBanner /> */}
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <button
        onClick={() => openLogModal()}
        className="bg-accent text-accent-on hover:bg-accent-hover fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg lg:hidden"
      >
        +
      </button>

      <LogEntryModal />
      <StampPicker />
    </div>
  );
}
