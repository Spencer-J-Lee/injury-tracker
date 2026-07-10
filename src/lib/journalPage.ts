const KEY = 'journal:lastPage'

export function getLastJournalPage(): number {
  const raw = localStorage.getItem(KEY)
  const n = raw ? Number(raw) : 1
  return Number.isFinite(n) && n >= 1 ? Math.trunc(n) : 1
}

export function setLastJournalPage(page: number) {
  if (page <= 1) {
    localStorage.removeItem(KEY)
  } else {
    localStorage.setItem(KEY, String(page))
  }
}
