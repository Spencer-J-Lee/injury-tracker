import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { exportBackup, importBackup, deleteAllData, getLastExportedAt } from '@/db/backup'
import { seedTestData, clearSeedTestData } from '@/db/seed'
import { formatRelative } from '@/lib/dates'

export function SettingsPage() {
  const [lastExportedAt, setLastExportedAt] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getLastExportedAt().then(setLastExportedAt)
  }, [])

  const handleExport = async () => {
    setBusy(true)
    setMessage(null)
    try {
      await exportBackup()
      setLastExportedAt(await getLastExportedAt())
      setMessage('Export downloaded.')
    } finally {
      setBusy(false)
    }
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      await importBackup(file)
      setLastExportedAt(await getLastExportedAt())
      setMessage('Import complete.')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const handleSeed = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const result = await seedTestData()
      setMessage(
        `Loaded ${result.injuriesCreated} injuries, ${result.remediesCreated} remedies, ${result.triggersCreated} triggers, and ${result.logEntriesCreated} log entries` +
          (result.injuriesDeleted > 0 ? ` (replaced ${result.injuriesDeleted} previous seed injuries).` : '.'),
      )
    } finally {
      setBusy(false)
    }
  }

  const handleClearSeed = async () => {
    if (!confirm('Clear seed data? This removes only the example injuries created by "Load example data".')) return
    setBusy(true)
    setMessage(null)
    try {
      const removed = await clearSeedTestData()
      setMessage(`Cleared ${removed} seed injur${removed === 1 ? 'y' : 'ies'}.`)
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Delete all injuries, remedies, and log entries? This cannot be undone.')) return
    setBusy(true)
    setMessage(null)
    try {
      await deleteAllData()
      setMessage('All data deleted.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-2xl font-semibold text-ink">Settings</h1>
      {message && <p className="text-[13px] text-pain-green">{message}</p>}

      <Card className="space-y-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Backup</h3>
          <p className="mt-1 text-[13px] text-ink-muted">
            All data is stored only in this browser. Export regularly to avoid losing it.
          </p>
          <p className="mt-1.5 text-xs text-ink-faint">
            {lastExportedAt ? `Last exported ${formatRelative(lastExportedAt)}` : 'Never exported'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button onClick={handleExport} disabled={busy}>
            Export data
          </Button>
          <Button variant="secondary" onClick={handleImportClick} disabled={busy} className="whitespace-nowrap">
            Import data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </Card>

      <Card className="space-y-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Seed data</h3>
          <p className="mt-1 text-[13px] text-ink-muted">
            Loads a set of example injuries, remedies, and log entries for testing. Re-running replaces previous
            seed data.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button onClick={handleSeed} disabled={busy}>
            Load example data
          </Button>
          <Button variant="secondary" onClick={handleClearSeed} disabled={busy}>
            Clear seed data
          </Button>
        </div>
      </Card>

      <Card className="space-y-3" style={{ borderColor: 'oklch(0.40 0.08 25)' }}>
        <div>
          <h3 className="text-[15px] font-semibold text-pain-red">Danger zone</h3>
          <p className="mt-1 text-[13px] text-ink-muted">
            Permanently delete every injury, remedy, and log entry.
          </p>
        </div>
        <Button variant="danger" onClick={handleDeleteAll} disabled={busy}>
          Delete all data
        </Button>
      </Card>
    </div>
  )
}
