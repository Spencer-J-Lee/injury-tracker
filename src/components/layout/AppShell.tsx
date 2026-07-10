import { Link, Outlet, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { useLogModal } from '@/context/useLogModal'
import { getLastJournalPage } from '@/lib/journalPage'

export function AppShell() {
  const location = useLocation()
  const { openLogModal } = useLogModal()

  const journalTo = () => {
    const page = getLastJournalPage()
    return page > 1 ? `/journal?page=${page}` : '/journal'
  }

  const navLinkMobile = (to: string, label: string) => (
    <Link
      to={to === '/journal' ? journalTo() : to}
      className={clsx(
        'rounded-[10px] px-3 py-1.5 text-sm',
        location.pathname === to
          ? 'bg-accent-soft font-semibold text-accent-soft-text'
          : 'font-medium text-ink-muted',
      )}
    >
      {label}
    </Link>
  )

  const navLinkSidebar = (to: string, label: string) => (
    <Link
      to={to === '/journal' ? journalTo() : to}
      className={clsx(
        'rounded-[10px] px-3 py-[9px] text-sm',
        location.pathname === to
          ? 'bg-accent-soft font-semibold text-accent-soft-text'
          : 'font-medium text-ink-muted hover:text-ink-secondary',
      )}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen bg-canvas-page">
      <div className="mx-auto max-w-[1400px] lg:p-6">
        <div className="bg-canvas lg:grid lg:grid-cols-[220px_1fr] lg:overflow-hidden lg:rounded-[20px] lg:border lg:border-subtle lg:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
          <aside className="hidden border-r border-subtle bg-canvas-sidebar lg:flex lg:flex-col lg:gap-5 lg:p-6">
            <Link to="/" className="font-heading text-[19px] font-semibold text-ink">
              Rehab Tracker
            </Link>
            <nav className="flex flex-col gap-1">
              {navLinkSidebar('/', 'Dashboard')}
              {navLinkSidebar('/journal', 'Journal')}
              {navLinkSidebar('/settings', 'Settings')}
            </nav>
          </aside>

          <div className="bg-canvas">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-subtle bg-canvas/90 px-4 py-3 backdrop-blur lg:hidden">
              <Link to="/" className="font-heading font-semibold text-ink">
                Rehab Tracker
              </Link>
              <nav className="flex gap-1">
                {navLinkMobile('/', 'Dashboard')}
                {navLinkMobile('/journal', 'Journal')}
                {navLinkMobile('/settings', 'Settings')}
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
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-accent-on shadow-lg hover:bg-accent-hover lg:hidden"
      >
        +
      </button>
    </div>
  )
}
